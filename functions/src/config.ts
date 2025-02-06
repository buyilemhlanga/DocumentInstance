interface Config {
  sourceCollectionPath: string;
  targetCollectionPath: string;
  sourceFields?: string[];
}

const config: Config = {
  sourceCollectionPath: process.env.SOURCE_COLLECTION!,
  targetCollectionPath: process.env.TARGET_COLLECTION!,
  sourceFields: process.env.SNAPSHOT_FIELDS?.split(","),
};

export default config;
