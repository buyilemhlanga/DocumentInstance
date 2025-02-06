/*
 * This template contains a HTTP function that responds
 * with a greeting when called
 *
 * Reference PARAMETERS in your functions code with:
 * `process.env.<parameter-name>`
 * Learn more about building extensions in the docs:
 * https://firebase.google.com/docs/extensions/publishers
 */
import * as firebase from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import config from "./config";


firebase.initializeApp();

firebase.initializeApp();

export const onSourceDocumentChange = onDocumentWritten(
  `${config.sourceCollectionPath}/{documentId}`,
  async (event) => {
    const db = firebase.firestore();
    const documentData = event.data?.after?.data() || null;

    if (!documentData) {
      console.log("Document was deleted. No action needed.");
      return;
    }

    // Extract only the specified fields if they are defined
    const finalData =
      config.sourceFields && config.sourceFields.length > 0
        ? config.sourceFields.reduce((acc: Record<string, any>, field: string) => {
            if (documentData[field] !== undefined) {
              acc[field] = documentData[field];
            }
            return acc;
          }, {})
        : { ...documentData };

    // Add timestamp field
    finalData.snapshotDate = firebase.firestore.FieldValue.serverTimestamp();

    // Add source document ID field
    finalData.sourceDocumentId = event.params.documentId;

    // Create new document in the target collection
    try {
      await db.collection(config.targetCollectionPath).add(finalData);
      console.log("Document successfully written to target collection.");
    } catch (error) {
      console.error("Error writing document to target collection:", error);
    }
  }
);