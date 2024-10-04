"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { sort } from "fast-sort";
import { saveAs } from "file-saver";

import {
  deleteAction,
  unvoidAction,
  selectAction,
  updateAction,
  updateLastRunAction,
} from "../actions";
import styles from "../../page.module.css";
import Table from "./table";
import InsertModal from "./insertModal";
import { dbTypePayload, groupTypePayload } from "./constants";

const AVAILABLE_SORT_OPTIONS = ["Time Updated", "Source Name"];

export default function Streaming() {
  const searchParams = useSearchParams();
  const env = searchParams.get("env");

  if (!env) {
    throw new Error("ENV MISSING");
  }

  const currentEnv = env.toLocaleUpperCase();

  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOnly, setActiveOnly] = useState(false);
  const [notVoidOnly, setNotVoidOnly] = useState(true);
  const [rowToDuplicate, setRowToDuplicate] = useState();
  const [loading, setLoading] = useState(false);
  const [groupCounts, setGroupCounts] = useState(new Map());
  const [availableSources, setAvailableSources] = useState([]);

  const [selectedSortingType, setSelectedSortingType] = useState(
    AVAILABLE_SORT_OPTIONS[0]
  );
  const [selectedType, setSelectedType] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const onOpenModal = () => setModalOpen(true);

  const onCloseModal = () => {
    setModalOpen(false);
    setRowToDuplicate();
    fetchData();
  };

  useEffect(() => {
    const initialFetch = async () => {
      fetchData();
    };

    initialFetch();
  }, [currentEnv]);

  async function fetchData() {
    setLoading(true);
    const data = await selectAction(currentEnv);

    console.log("fetchData", JSON.stringify(data));

    setList(data);
    setLoading(false);

    const grpCounts = new Map();
    groupTypePayload.map((group) => {
      grpCounts.set(group.value, 0);
    });
    data.forEach((item) => {
      grpCounts.set(
        item.groupid || "unknown",
        (grpCounts.get(item.groupid || "unknown") || 0) + 1
      );
    });
    setGroupCounts(grpCounts);

    const sources = [
      ...new Set(
        data.map((item) => item.source_system_name).filter((item) => item)
      ),
    ];

    setAvailableSources(sources);
  }

  const handleActiveChange = (e) => {
    setActiveOnly(e.target.checked);
  };

  const handleVoidChange = (e) => {
    setNotVoidOnly(e.target.checked);
  };

  const updateRow = async (row) => {
    const result = await updateAction(row, env);

    if (!result) {
      toast.error("Failed to update row");
      return;
    }

    toast.success("Row updated");

    setList((prevList) => {
      const newList = prevList.map((item) => {
        if (
          item.source_system_name === row.source_system_name &&
          item.source_table_name === row.source_table_name &&
          item.target_table_name === row.target_table_name
        ) {
          return row;
        }
        return item;
      });
      return newList;
    });
  };

  const deleteRow = async (row) => {
    const updatedRow = {
      ...row,
      voided_by: "system",
      active: "N",
      updated_date: Date.now() / 1000,
    };

    const result = await deleteAction(updatedRow, env);

    if (!result) {
      toast.error("Failed to delete row");
      return;
    }

    toast.success("Row deleted");

    setList((prevList) => {
      const newList = prevList.map((item) => {
        if (
          item.source_system_name === updatedRow.source_system_name &&
          item.source_table_name === updatedRow.source_table_name
        ) {
          return updatedRow;
        }
        return item;
      });
      return newList;
    });
  };

  const unvoidRow = async (row) => {
    const updatedRow = {
      ...row,
      voided_by: "",
      active: "N",
      updated_date: Date.now() / 1000,
    };

    const result = await unvoidAction(updatedRow, env);

    if (!result) {
      toast.error("Failed to unvoid row");
      return;
    }

    toast.success("Row un-voided");

    setList((prevList) => {
      const newList = prevList.map((item) => {
        if (
          item.source_system_name === updatedRow.source_system_name &&
          item.source_table_name === updatedRow.source_table_name
        ) {
          return updatedRow;
        }
        return item;
      });
      return newList;
    });
  };

  const handleSortingTypeChange = (e) => {
    setSelectedSortingType(e.target.value);
  };

  const handleCopy = async (dataToCopy) => {
    try {
      await navigator.clipboard.writeText(dataToCopy);
      toast.success("CQL Copied to clipboard updated");
    } catch (error) {
      toast.error("Failed to copy to clip board");
    }
  };

  const handleDuplicateRow = (row) => {
    setRowToDuplicate(row);
    setModalOpen(true);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };
  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
  };

  const createRunFreqReset = async (definedGroup) => {
    const results = [];

    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (
        row.active !== "Y" ||
        row.groupid !== definedGroup ||
        row.run_frequency_in_secs < 3600
      ) {
        continue;
      }
      const query = `UPDATE wip_configurations.spark_streaming_table_config SET run_frequency_in_secs = 300 WHERE source_system_name = '${row.source_system_name}' AND source_table_name = '${row.source_table_name}';`;

      results.push(query);
    }

    handleCopy(results.join("\n"));
  };

  const filteredList = list.filter((item) => {
    const matchesActive = activeOnly ? item.active === "Y" : true;
    const matchesVoid = notVoidOnly ? !item.voided_by : true;
    const matchesType = selectedType
      ? item.source_system_dbtype === selectedType
      : true;
    const matchesSource = selectedSource
      ? item.source_system_name === selectedSource
      : true;
    const matchesGroup = selectedGroup ? item.groupid === selectedGroup : true;

    return (
      matchesActive &&
      matchesVoid &&
      matchesSource &&
      matchesType &&
      matchesGroup
    );
  });

  const sorted =
    selectedSortingType === "Source Name"
      ? sort(filteredList).asc(
          (r) => r.source_system_name + +r.source_table_name
        )
      : sort(filteredList).desc((r) => r.updated_date);

  const exportToJson = () => {
    const json = JSON.stringify(sorted, null, 2); // Pretty print JSON
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, "streaming_data.json");
  };

  return (
    <main
      className={`${styles.streaming} ${loading ? styles.loadingCursor : ""}`}
    >
      {currentEnv !== "UAT" && (
        <div
          style={{
            width: "100%",
            backgroundColor: "red",
            color: "black",
            textAlign: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          PRODUCTION ENVIRONMENT
        </div>
      )}
      <h1>Streaming table</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 40,
          marginTop: 5,
        }}
      >
        <div style={{ marginRight: 20 }}>
          <label>
            Sort by:
            <select
              value={selectedSortingType}
              onChange={handleSortingTypeChange}
            >
              {AVAILABLE_SORT_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginRight: 20 }}>
          <label>
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={handleActiveChange}
            />
            Active Only
          </label>
        </div>
        <div style={{ marginRight: 20 }}>
          <label>
            <input
              type="checkbox"
              checked={notVoidOnly}
              onChange={handleVoidChange}
            />
            Not Void Only
          </label>
        </div>
        <div style={{ marginRight: 20 }}>
          <label>
            Source:
            <select value={selectedSource} onChange={handleSourceChange}>
              <option value="">All</option>
              {availableSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginRight: 20 }}>
          <label>
            Type:
            <select value={selectedType} onChange={handleTypeChange}>
              <option value="">All</option>
              {dbTypePayload.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginRight: 20 }}>
          <label>
            Group:
            <select value={selectedGroup} onChange={handleGroupChange}>
              <option value="">All</option>
              {groupTypePayload.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <span>loading...</span>
        ) : (
          <div>
            <button style={{ padding: "1px 4px" }} onClick={fetchData}>
              Refresh
            </button>
            <button
              style={{ marginLeft: "5px", padding: "1px 4px" }}
              onClick={onOpenModal}
            >
              Insert
            </button>
          </div>
        )}
      </div>
      <Table
        data={sorted}
        updateRow={updateRow}
        deleteRow={deleteRow}
        unvoidRow={unvoidRow}
        updateLastRunAction={updateLastRunAction}
        handleDuplicateRow={handleDuplicateRow}
      />
      <ToastContainer />
      <InsertModal
        modalOpen={modalOpen}
        onCloseModal={onCloseModal}
        streamingData={list}
        rowToDuplicate={rowToDuplicate}
      />
      <div className="footer">
        {[...groupCounts].map(([key, value]) => (
          <span
            key={key}
            style={{ fontSize: 14, marginLeft: 25, marginRight: 25 }}
          >
            {key}: {value}
          </span>
        ))}
      </div>
      <button
        disabled={loading}
        style={{ marginTop: "20px", padding: "2px 6px" }}
        onClick={exportToJson}
      >
        Export JSON
      </button>
    </main>
  );
}
