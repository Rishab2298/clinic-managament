{
  /*If you want to have nested fields within the prescription schema, such as a "Vitals" object with subfields like "pulse rate," you can define the schema accordingly. Here's an example of how you can modify the schema to include nested fields:

```javascript*/
}
const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  pulseRate: {
    type: String,
  },
  // Add more vitals fields as needed
});

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  medication: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
  },
  instructions: {
    type: String,
  },
  isFilled: {
    type: Boolean,
    default: false,
  },
  vitals: vitalsSchema, // Embed the vitals subdocument
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;

{
  /*In this updated schema:

1. We define a `vitalsSchema` to represent the "Vitals" subdocument. You can add more fields under `vitalsSchema` as needed.

2. The main `prescriptionSchema` includes a field called "vitals," which is of type `vitalsSchema`. This allows you to embed the vitals subdocument within each prescription.

Now, you can create a prescription with vitals information like this:

```javascript*/
}
const newPrescription = new Prescription({
  patient: patientId, // Replace with the actual patient's ObjectId
  doctor: doctorId, // Replace with the actual doctor's ObjectId
  medication: "Aspirin",
  dosage: "1 tablet daily",
  instructions: "Take with food",
  vitals: {
    pulseRate: "70 bpm",
    // Add other vitals data here
  },
});

newPrescription.save((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Prescription saved successfully.");
  }
});

//This structure allows you to store prescription information with nested vitals data within each prescription record.

import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

const PrescriptionForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control,
    name: "medication",
  });

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control,
    name: "diagnosis",
  });

  const {
    fields: symptomFields,
    append: appendSymptom,
    remove: removeSymptom,
  } = useFieldArray({
    control,
    name: "symptoms",
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <div>
        <label htmlFor="patient">Patient</label>
        <input type="text" id="patient" {...register("patient")} />
      </div>
      <div>
        <label htmlFor="doctor">Doctor</label>
        <input type="text" id="doctor" {...register("doctor")} />
      </div>

      <h2>Medication</h2>
      {medicationFields.map((medication, index) => (
        <div key={medication.id}>
          <div>
            <label htmlFor={`medication[${index}].medicine`}>
              Medicine Name
            </label>
            <input
              type="text"
              id={`medication[${index}].medicine`}
              {...register(`medication[${index}].medicine`)}
            />
          </div>
          <div>
            <label htmlFor={`medication[${index}].dosage`}>Dosage</label>
            <input
              type="text"
              id={`medication[${index}].dosage`}
              {...register(`medication[${index}].dosage`)}
            />
          </div>
          {/* Add more medication fields here */}
          <button type="button" onClick={() => removeMedication(index)}>
            Remove Medication
          </button>
        </div>
      ))}
      <button type="button" onClick={() => appendMedication({})}>
        Add Medication
      </button>

      <h2>Diagnosis</h2>
      {diagnosisFields.map((diagnosis, index) => (
        <div key={diagnosis.id}>
          <div>
            <label htmlFor={`diagnosis[${index}].diagnosis`}>
              Diagnosis Name
            </label>
            <input
              type="text"
              id={`diagnosis[${index}].diagnosis`}
              {...register(`diagnosis[${index}].diagnosis`)}
            />
          </div>
          <div>
            <label htmlFor={`diagnosis[${index}].duration`}>Duration</label>
            <input
              type="text"
              id={`diagnosis[${index}].duration`}
              {...register(`diagnosis[${index}].duration`)}
            />
          </div>
          {/* Add more diagnosis fields here */}
          <button type="button" onClick={() => removeDiagnosis(index)}>
            Remove Diagnosis
          </button>
        </div>
      ))}
      <button type="button" onClick={() => appendDiagnosis({})}>
        Add Diagnosis
      </button>

      <h2>Symptoms</h2>
      {symptomFields.map((symptom, index) => (
        <div key={symptom.id}>
          <div>
            <label htmlFor={`symptoms[${index}].symptom`}>Symptom Name</label>
            <input
              type="text"
              id={`symptoms[${index}].symptom`}
              {...register(`symptoms[${index}].symptom`)}
            />
          </div>
          <div>
            <label htmlFor={`symptoms[${index}].duration`}>Duration</label>
            <input
              type="text"
              id={`symptoms[${index}].duration`}
              {...register(`symptoms[${index}].duration`)}
            />
          </div>
          {/* Add more symptom fields here */}
          <button type="button" onClick={() => removeSymptom(index)}>
            Remove Symptom
          </button>
        </div>
      ))}
      <button type="button" onClick={() => appendSymptom({})}>
        Add Symptom
      </button>

      {/* Vitals Fields */}
      <h2>Vitals</h2>
      <div>
        <label htmlFor="vitals.pulseRate">Pulse Rate</label>
        <input
          type="text"
          id="vitals.pulseRate"
          {...register("vitals.pulseRate")}
        />
      </div>
      {/* Add more vitals fields here */}

      <button type="submit">Submit</button>
    </form>
  );
};

export default PrescriptionForm;
