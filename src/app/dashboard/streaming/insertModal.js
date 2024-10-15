import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import styles from "./insertModal.module.css";
import { insertAction } from "../actions";
import { dbTypePayload, facilityPayload, groupTypePayload } from "./constants";
import { useSearchParams } from "next/navigation";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const initialFormData = {
  source_system_name: "",
  source_table_name: "",
  active: "N",
  alert_frequency_in_secs: "30000",
  batch_size: "1",
  facility: [],
  groupid: "",
  run_frequency_in_secs: "300",
  default_run_frequency_in_secs: "300",
  source_system_dbtype: "",
  source_table_query: "",
  target_keyspace: "",
  target_table_name: "",
};

const InsertModal = ({
  modalOpen,
  onCloseModal,
  streamingData,
  rowToDuplicate,
}) => {
  const env = useSearchParams().get("env");
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");

  const [showFacilitySelect, setShowFacilitySelect] = useState(false);

  useEffect(() => {
    if (rowToDuplicate && Object.keys(rowToDuplicate).length) {
      setFormData(rowToDuplicate);
    }
  }, [rowToDuplicate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "run_frequency_in_secs" && {
        default_run_frequency_in_secs: value,
      }),
    }));

    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = Object.entries(formData).some(
      ([key, value]) => key !== "facility" && value === ""
    );

    if (hasEmptyFields) {
      setFormError("All fields except 'Facility' must be filled in.");
      return;
    }

    const parsed_default_run_frequency_in_secs = parseInt(
      formData.default_run_frequency_in_secs
    );
    if (
      !parsed_default_run_frequency_in_secs ||
      isNaN(parsed_default_run_frequency_in_secs) ||
      parsed_default_run_frequency_in_secs === 0
    ) {
      return setFormError("Invalid Default Run Frequency value.");
    }

    const combinationExists = streamingData?.find(
      (item) =>
        item.source_system_name === formData.source_system_name &&
        item.source_table_name === formData.source_table_name
    );

    if (combinationExists) {
      setFormError(
        "The combination of `source_system_name` and `source_table_name` already exists, please enter some other value"
      );
      return;
    }

    console.log("Form Data Submitted: ", formData);

    const response = await insertAction(
      {
        ...formData,
        target_table_list: [
          `${formData.target_keyspace}.${formData.target_table_name}`,
        ],
        facility: formData.facility.join(" | "),
      },
      env
    );

    if (response) {
      handleCloseModal();
    }

    setFormError("");
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setFormError("");
    onCloseModal();
  };

  const handleFacilityChange = (e, code) => {
    console.log("facii", formData.facility);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, facility: [...prev.facility, code] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        facility: prev.facility.filter((item) => item !== code),
      }));
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      center
      classNames={{
        overlay: styles.customOverlay,
        modal: styles.customModal,
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Source System Name</label>
          <input
            type="text"
            name="source_system_name"
            value={formData.source_system_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Source Table Name</label>
          <input
            type="text"
            name="source_table_name"
            value={formData.source_table_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Active</label>
          <input type="text" name="active" value={formData.active} readOnly />
        </div>
        <div className={styles.field}>
          <label>Alert Frequency (secs)</label>
          <input
            type="text"
            name="alert_frequency_in_secs"
            value={formData.alert_frequency_in_secs}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Batch Size</label>
          <input
            type="text"
            name="batch_size"
            value={formData.batch_size}
            readOnly
          />
        </div>
        <div
          className={styles.field}
          style={{
            position: "relative",
          }}
        >
          <label>Facility</label>
          <input
            onClick={(e) => {
              e.stopPropagation();
              setShowFacilitySelect(!showFacilitySelect);
            }}
            type="text"
            name="facilities"
            id="facilities"
            value={formData.facility
              ?.map(
                (faci) =>
                  facilityPayload.find((item) => item.value === faci)?.label
              )
              ?.join(" | ")}
            style={{
              marginTop: 2,
              marginBottom: 2,
              width: "100%",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 5,
              top: 11,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowFacilitySelect(!showFacilitySelect);
            }}
          >
            {showFacilitySelect ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
          </span>
          <span
            onClick={(e) => e.stopPropagation()}
            style={{
              display: showFacilitySelect ? "flex" : "none",
              position: "absolute",
              top: 40,
              left: 257,
              height: 300,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "2px",
              backgroundColor: "white",
              paddingLeft: 4,
              paddingRight: 1,
              paddingTop: 1,
              paddingBottom: 1,
              border: "1px solid lightgray",
              borderRadius: 4,
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {facilityPayload.map((item, i) => (
              <span
                key={item.value}
                style={{
                  width: 250,
                  padding: "1px 0",
                }}
              >
                <input
                  type="checkbox"
                  name={item.label}
                  id={item.value}
                  onChange={(e) => {
                    handleFacilityChange(e, item.value);
                  }}
                  style={{
                    marginRight: 5,
                  }}
                  checked={formData.facility.includes(item.value)}
                />
                <label htmlFor={item.value}>{item.label}</label>
              </span>
            ))}
          </span>
        </div>
        <div className={styles.field}>
          <label>Group ID</label>
          <select
            name="groupid"
            value={formData.groupid}
            onChange={handleChange}
          >
            <option value="">Select Group ID</option>
            {groupTypePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Run Frequency (secs)</label>
          <input
            type="text"
            name="run_frequency_in_secs"
            value={formData.run_frequency_in_secs}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Default Run Frequency (secs)</label>
          <input
            type="text"
            name="default_run_frequency_in_secs"
            value={formData.default_run_frequency_in_secs}
            readOnly
          />
        </div>
        <div className={styles.field}>
          <label>Source System DB Type</label>
          <select
            name="source_system_dbtype"
            value={formData.source_system_dbtype}
            onChange={handleChange}
          >
            <option value="">Select DB Type</option>
            {dbTypePayload.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Source Table Query</label>
          <textarea
            name="source_table_query"
            value={formData.source_table_query}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Target Keyspace</label>
          <input
            type="text"
            name="target_keyspace"
            value={formData.target_keyspace}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label>Target Table Name</label>
          <input
            type="text"
            name="target_table_name"
            value={formData.target_table_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.submitButtonWrapper}>
          {formError && <div className={styles.error}>{formError}</div>}
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InsertModal;
