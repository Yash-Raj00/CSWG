import React, { useEffect, useRef, useState } from "react";
import Modal from "react-responsive-modal";
import styles from "./insertModal.module.css";
import { insertAction } from "../actions";
import { dbTypePayload, facilityPayload, groupTypePayload } from "./constants";
import { useSearchParams } from "next/navigation";
import { MultiSelect } from "react-multi-select-component";

const initialFormData = {
  source_system_name: "",
  source_table_name: "",
  active: "N",
  alert_frequency_in_secs: "30000",
  batch_size: "1",
  facility: [],
  rest_url: "",
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

  const [tempFacilities, setTempFacilities] = useState([]);

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
        facility: tempFacilities.map((faci) => faci.value).join(" | "),
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
        // className={styles.field}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          <label style={{ flex: 1, marginRight: 4, color: "#333" }}>
            Facility
          </label>
          <span style={{ flex: 2, maxWidth: 504 }}>
            <MultiSelect
              options={facilityPayload}
              value={tempFacilities}
              onChange={setTempFacilities}
              labelledBy="Facility"
            />
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
          <label>Rest URL</label>
          <input
            type="text"
            name="rest_url"
            value={formData.rest_url}
            disabled={formData.source_system_dbtype !== "REST-Webservice"}
          />
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
