/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
  AnyDataModel,
} from "convex/server";
import type { GenericId } from "convex/values";

/**
 * A type describing your Convex data model.
 *
 * This type includes information about what tables you have, the type of
 * documents stored in those tables, and the indexes defined on them.
 *
 * This type is used to parameterize methods like `queryGeneric` and
 * `mutationGeneric` to make them type-safe.
 */

export type DataModel = {
  account: {
    document: {
      accessToken?: null | string;
      accessTokenExpiresAt?: null | number;
      accountId: string;
      createdAt?: number;
      idToken?: null | string;
      password?: null | string;
      providerId: string;
      refreshToken?: null | string;
      refreshTokenExpiresAt?: null | number;
      scope?: null | string;
      updatedAt?: null | number;
      userId: Id<"user">;
      _id: Id<"account">;
      _creationTime: number;
    };
    fieldPaths:
      | "accessToken"
      | "accessTokenExpiresAt"
      | "accountId"
      | "createdAt"
      | "_creationTime"
      | "_id"
      | "idToken"
      | "password"
      | "providerId"
      | "refreshToken"
      | "refreshTokenExpiresAt"
      | "scope"
      | "updatedAt"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_accountId: ["accountId", "_creationTime"];
      by_accountId_providerId: ["accountId", "providerId", "_creationTime"];
      by_providerId_userId: ["providerId", "userId", "_creationTime"];
      by_userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  aggregate_bucket: {
    document: {
      count: number;
      indexName: string;
      keyHash: string;
      keyParts: Array<any>;
      nonNullCountValues: Record<string, number>;
      sumValues: Record<string, number>;
      tableKey: string;
      updatedAt: number;
      _id: Id<"aggregate_bucket">;
      _creationTime: number;
    };
    fieldPaths:
      | "count"
      | "_creationTime"
      | "_id"
      | "indexName"
      | "keyHash"
      | "keyParts"
      | "nonNullCountValues"
      | `nonNullCountValues.${string}`
      | "sumValues"
      | `sumValues.${string}`
      | "tableKey"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_table_index: ["tableKey", "indexName", "_creationTime"];
      by_table_index_hash: [
        "tableKey",
        "indexName",
        "keyHash",
        "_creationTime",
      ];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  aggregate_extrema: {
    document: {
      count: number;
      fieldName: string;
      indexName: string;
      keyHash: string;
      sortKey: string;
      tableKey: string;
      updatedAt: number;
      value: any;
      valueHash: string;
      _id: Id<"aggregate_extrema">;
      _creationTime: number;
    };
    fieldPaths:
      | "count"
      | "_creationTime"
      | "fieldName"
      | "_id"
      | "indexName"
      | "keyHash"
      | "sortKey"
      | "tableKey"
      | "updatedAt"
      | "value"
      | "valueHash";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_table_index: ["tableKey", "indexName", "_creationTime"];
      by_table_index_hash_field_sort: [
        "tableKey",
        "indexName",
        "keyHash",
        "fieldName",
        "sortKey",
        "_creationTime",
      ];
      by_table_index_hash_field_value: [
        "tableKey",
        "indexName",
        "keyHash",
        "fieldName",
        "valueHash",
        "_creationTime",
      ];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  aggregate_member: {
    document: {
      docId: string;
      extremaValues: Record<string, any>;
      indexName: string;
      keyHash: string;
      keyParts: Array<any>;
      kind: string;
      nonNullCountValues: Record<string, number>;
      rankKey?: null | any;
      rankNamespace?: null | any;
      rankSumValue?: null | number;
      sumValues: Record<string, number>;
      tableKey: string;
      updatedAt: number;
      _id: Id<"aggregate_member">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "docId"
      | "extremaValues"
      | `extremaValues.${string}`
      | "_id"
      | "indexName"
      | "keyHash"
      | "keyParts"
      | "kind"
      | "nonNullCountValues"
      | `nonNullCountValues.${string}`
      | "rankKey"
      | "rankNamespace"
      | "rankSumValue"
      | "sumValues"
      | `sumValues.${string}`
      | "tableKey"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_kind_table_index: ["kind", "tableKey", "indexName", "_creationTime"];
      by_kind_table_index_doc: [
        "kind",
        "tableKey",
        "indexName",
        "docId",
        "_creationTime",
      ];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  aggregate_rank_node: {
    document: {
      aggregate?: null | { count: number; sum: number };
      items: Array<{ k: any; s: number; v: any }>;
      subtrees: Array<string>;
      _id: Id<"aggregate_rank_node">;
      _creationTime: number;
    };
    fieldPaths:
      | "aggregate"
      | "aggregate.count"
      | "aggregate.sum"
      | "_creationTime"
      | "_id"
      | "items"
      | "subtrees";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  aggregate_rank_tree: {
    document: {
      aggregateName: string;
      maxNodeSize: number;
      namespace?: null | any;
      root: Id<"aggregate_rank_node">;
      _id: Id<"aggregate_rank_tree">;
      _creationTime: number;
    };
    fieldPaths:
      | "aggregateName"
      | "_creationTime"
      | "_id"
      | "maxNodeSize"
      | "namespace"
      | "root";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_aggregate_name: ["aggregateName", "_creationTime"];
      by_namespace: ["namespace", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  aggregate_state: {
    document: {
      completedAt?: null | number;
      cursor?: null | string;
      indexName: string;
      keyDefinitionHash: string;
      kind: string;
      lastError?: null | string;
      metricDefinitionHash: string;
      processed: number;
      startedAt: number;
      status: string;
      tableKey: string;
      updatedAt: number;
      _id: Id<"aggregate_state">;
      _creationTime: number;
    };
    fieldPaths:
      | "completedAt"
      | "_creationTime"
      | "cursor"
      | "_id"
      | "indexName"
      | "keyDefinitionHash"
      | "kind"
      | "lastError"
      | "metricDefinitionHash"
      | "processed"
      | "startedAt"
      | "status"
      | "tableKey"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_kind_status: ["kind", "status", "_creationTime"];
      by_kind_table_index: ["kind", "tableKey", "indexName", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  cellValue: {
    document: {
      databaseId: Id<"database">;
      pageId: Id<"page">;
      propertyId: Id<"property">;
      updatedAt?: null | number;
      value?:
        | null
        | { text: string; type: "title" }
        | { text: string; type: "text" }
        | { number: number; type: "number" }
        | { checkbox: boolean; type: "checkbox" }
        | { optionId: string; type: "select" }
        | { optionIds: Array<string>; type: "multi_select" }
        | { end?: number; start: number; type: "date" }
        | { type: "person"; userIds: Array<Id<"user">> }
        | {
            files: Array<{ mimeType?: string; name: string; url: string }>;
            type: "files";
          }
        | { type: "url"; url: string }
        | { email: string; type: "email" }
        | { phone: string; type: "phone" }
        | { result: string; type: "formula" }
        | { pageIds: Array<Id<"page">>; type: "relation" }
        | { result: string; type: "rollup" }
        | { optionId: string; type: "status" }
        | { type: "created_time" }
        | { type: "created_by" }
        | { type: "last_edited_time" }
        | { type: "last_edited_by" };
      _id: Id<"cellValue">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "databaseId"
      | "_id"
      | "pageId"
      | "propertyId"
      | "updatedAt"
      | "value"
      | "value.checkbox"
      | "value.email"
      | "value.end"
      | "value.files"
      | "value.number"
      | "value.optionId"
      | "value.optionIds"
      | "value.pageIds"
      | "value.phone"
      | "value.result"
      | "value.start"
      | "value.text"
      | "value.type"
      | "value.url"
      | "value.userIds";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      databaseId: ["databaseId", "_creationTime"];
      pageId: ["pageId", "_creationTime"];
      pageId_propertyId: ["pageId", "propertyId", "_creationTime"];
      propertyId: ["propertyId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  database: {
    document: {
      coverImage?: null | string;
      createdAt?: number;
      createdBy: Id<"user">;
      description?: null | string;
      icon?: null | string;
      lastEditedBy: Id<"user">;
      organizationId: Id<"organization">;
      pageId: Id<"page">;
      position?: null | number;
      title?: null | string;
      updatedAt?: null | number;
      _id: Id<"database">;
      _creationTime: number;
    };
    fieldPaths:
      | "coverImage"
      | "createdAt"
      | "createdBy"
      | "_creationTime"
      | "description"
      | "icon"
      | "_id"
      | "lastEditedBy"
      | "organizationId"
      | "pageId"
      | "position"
      | "title"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      createdBy: ["createdBy", "_creationTime"];
      organizationId: ["organizationId", "_creationTime"];
      pageId: ["pageId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  invitation: {
    document: {
      createdAt?: number;
      email: string;
      expiresAt: number;
      inviterId?: null | Id<"user">;
      organizationId: Id<"organization">;
      role?: null | string;
      status: string;
      _id: Id<"invitation">;
      _creationTime: number;
    };
    fieldPaths:
      | "createdAt"
      | "_creationTime"
      | "email"
      | "expiresAt"
      | "_id"
      | "inviterId"
      | "organizationId"
      | "role"
      | "status";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_email: ["email", "_creationTime"];
      by_email_organizationId_status: [
        "email",
        "organizationId",
        "status",
        "_creationTime",
      ];
      by_email_status: ["email", "status", "_creationTime"];
      by_inviterId: ["inviterId", "_creationTime"];
      by_organizationId_email: ["organizationId", "email", "_creationTime"];
      by_organizationId_email_status: [
        "organizationId",
        "email",
        "status",
        "_creationTime",
      ];
      by_organizationId_status: ["organizationId", "status", "_creationTime"];
      by_status: ["status", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  jwks: {
    document: {
      createdAt?: number;
      privateKey: string;
      publicKey: string;
      _id: Id<"jwks">;
      _creationTime: number;
    };
    fieldPaths:
      | "createdAt"
      | "_creationTime"
      | "_id"
      | "privateKey"
      | "publicKey";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  member: {
    document: {
      organizationId: Id<"organization">;
      role: string;
      userId: Id<"user">;
      _id: Id<"member">;
      _creationTime: number;
    };
    fieldPaths: "_creationTime" | "_id" | "organizationId" | "role" | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_organizationId_role: ["organizationId", "role", "_creationTime"];
      by_organizationId_userId: ["organizationId", "userId", "_creationTime"];
      by_role: ["role", "_creationTime"];
      by_userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  migration_run: {
    document: {
      allowDrift: boolean;
      cancelRequested: boolean;
      completedAt?: null | number;
      currentIndex: number;
      direction: string;
      dryRun: boolean;
      lastError?: null | string;
      migrationIds: Array<string>;
      runId: string;
      startedAt: number;
      status: string;
      updatedAt: number;
      _id: Id<"migration_run">;
      _creationTime: number;
    };
    fieldPaths:
      | "allowDrift"
      | "cancelRequested"
      | "completedAt"
      | "_creationTime"
      | "currentIndex"
      | "direction"
      | "dryRun"
      | "_id"
      | "lastError"
      | "migrationIds"
      | "runId"
      | "startedAt"
      | "status"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_run_id: ["runId", "_creationTime"];
      by_status: ["status", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  migration_state: {
    document: {
      applied: boolean;
      checksum: string;
      completedAt?: null | number;
      cursor?: null | string;
      direction?: null | string;
      lastError?: null | string;
      migrationId: string;
      processed: number;
      runId?: null | string;
      startedAt?: null | number;
      status: string;
      updatedAt: number;
      writeMode: string;
      _id: Id<"migration_state">;
      _creationTime: number;
    };
    fieldPaths:
      | "applied"
      | "checksum"
      | "completedAt"
      | "_creationTime"
      | "cursor"
      | "direction"
      | "_id"
      | "lastError"
      | "migrationId"
      | "processed"
      | "runId"
      | "startedAt"
      | "status"
      | "updatedAt"
      | "writeMode";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_migration_id: ["migrationId", "_creationTime"];
      by_status: ["status", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  organization: {
    document: {
      code: string;
      createdAt?: number;
      link: string;
      logo?: null | string;
      metadata?: null | string;
      name: string;
      plan: string;
      slug: string;
      _id: Id<"organization">;
      _creationTime: number;
    };
    fieldPaths:
      | "code"
      | "createdAt"
      | "_creationTime"
      | "_id"
      | "link"
      | "logo"
      | "metadata"
      | "name"
      | "plan"
      | "slug";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_name: ["name", "_creationTime"];
      by_slug: ["slug", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  page: {
    document: {
      block?:
        | null
        | { type: "page" }
        | { type: "database" }
        | { type: "divider" }
        | { type: "column_list" }
        | { type: "column" }
        | {
            cells: Array<
              Array<{
                bold?: boolean;
                code?: boolean;
                color?: string;
                expression?: string;
                href?: string;
                italic?: boolean;
                mentionTargetId?: string;
                strikethrough?: boolean;
                text?: string;
                type: "text" | "mention_user" | "mention_page" | "equation";
                underline?: boolean;
              }>
            >;
            type: "table_row";
          }
        | { type: "template" }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            type: "paragraph";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            isToggleable?: boolean;
            type: "heading_1";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            isToggleable?: boolean;
            type: "heading_2";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            isToggleable?: boolean;
            type: "heading_3";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            type: "bulleted_list_item";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            type: "numbered_list_item";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            type: "toggle";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            type: "quote";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            calloutIcon?: string;
            type: "callout";
          }
        | {
            body: Array<{
              bold?: boolean;
              code?: boolean;
              color?: string;
              expression?: string;
              href?: string;
              italic?: boolean;
              mentionTargetId?: string;
              strikethrough?: boolean;
              text?: string;
              type: "text" | "mention_user" | "mention_page" | "equation";
              underline?: boolean;
            }>;
            checked: boolean;
            type: "to_do";
          }
        | {
            caption?: string;
            code: string;
            language:
              | "abap"
              | "arduino"
              | "bash"
              | "basic"
              | "c"
              | "clojure"
              | "coffeescript"
              | "cpp"
              | "csharp"
              | "css"
              | "dart"
              | "diff"
              | "docker"
              | "elixir"
              | "elm"
              | "erlang"
              | "flow"
              | "fortran"
              | "fsharp"
              | "gherkin"
              | "glsl"
              | "go"
              | "graphql"
              | "groovy"
              | "haskell"
              | "html"
              | "java"
              | "javascript"
              | "json"
              | "julia"
              | "kotlin"
              | "latex"
              | "less"
              | "lisp"
              | "livescript"
              | "lua"
              | "makefile"
              | "markdown"
              | "markup"
              | "matlab"
              | "mermaid"
              | "nix"
              | "objective_c"
              | "ocaml"
              | "pascal"
              | "perl"
              | "php"
              | "plain_text"
              | "powershell"
              | "prolog"
              | "protobuf"
              | "python"
              | "r"
              | "reason"
              | "ruby"
              | "rust"
              | "sass"
              | "scala"
              | "scheme"
              | "scss"
              | "shell"
              | "sql"
              | "swift"
              | "typescript"
              | "vb_net"
              | "verilog"
              | "vhdl"
              | "visual_basic"
              | "webassembly"
              | "xml"
              | "yaml"
              | "java_or_kotlin";
            type: "code";
          }
        | { caption?: string; type: "image"; url: string; width?: number }
        | { caption?: string; type: "video"; url: string }
        | {
            caption?: string;
            mimeType?: string;
            name: string;
            size?: number;
            type: "file";
            url: string;
          }
        | {
            bookmarkTitle?: string;
            description?: string;
            previewImage?: string;
            type: "bookmark";
            url: string;
          }
        | { caption?: string; type: "embed"; url: string }
        | {
            columnCount: number;
            hasColumnHeader: boolean;
            hasRowHeader: boolean;
            type: "table";
          }
        | { syncedFromPageId?: Id<"page">; type: "synced_block" };
      color?:
        | null
        | "default"
        | "gray"
        | "brown"
        | "orange"
        | "yellow"
        | "green"
        | "blue"
        | "purple"
        | "pink"
        | "red"
        | "gray_background"
        | "brown_background"
        | "orange_background"
        | "yellow_background"
        | "green_background"
        | "blue_background"
        | "purple_background"
        | "pink_background"
        | "red_background";
      coverImage?: null | string;
      createdAt?: number;
      createdBy: Id<"user">;
      databaseId?: null | Id<"database">;
      icon?: null | string;
      isArchived: boolean;
      isTrashed: boolean;
      lastEditedBy: Id<"user">;
      organizationId: Id<"organization">;
      parentId?: null | Id<"page">;
      sortOrder: string;
      title?: null | string;
      trashedAt?: null | number;
      type:
        | "page"
        | "database"
        | "paragraph"
        | "heading_1"
        | "heading_2"
        | "heading_3"
        | "heading_4"
        | "heading_5"
        | "heading_6"
        | "bulleted_list_item"
        | "numbered_list_item"
        | "to_do"
        | "toggle"
        | "quote"
        | "callout"
        | "divider"
        | "code"
        | "image"
        | "video"
        | "file"
        | "bookmark"
        | "embed"
        | "table"
        | "table_row"
        | "column_list"
        | "column"
        | "template"
        | "synced_block";
      updatedAt?: null | number;
      _id: Id<"page">;
      _creationTime: number;
    };
    fieldPaths:
      | "block"
      | "block.body"
      | "block.bookmarkTitle"
      | "block.calloutIcon"
      | "block.caption"
      | "block.cells"
      | "block.checked"
      | "block.code"
      | "block.columnCount"
      | "block.description"
      | "block.hasColumnHeader"
      | "block.hasRowHeader"
      | "block.isToggleable"
      | "block.language"
      | "block.mimeType"
      | "block.name"
      | "block.previewImage"
      | "block.size"
      | "block.syncedFromPageId"
      | "block.type"
      | "block.url"
      | "block.width"
      | "color"
      | "coverImage"
      | "createdAt"
      | "createdBy"
      | "_creationTime"
      | "databaseId"
      | "icon"
      | "_id"
      | "isArchived"
      | "isTrashed"
      | "lastEditedBy"
      | "organizationId"
      | "parentId"
      | "sortOrder"
      | "title"
      | "trashedAt"
      | "type"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      createdBy: ["createdBy", "_creationTime"];
      databaseId: ["databaseId", "_creationTime"];
      isTrashed: ["isTrashed", "_creationTime"];
      organizationId: ["organizationId", "_creationTime"];
      organizationId_type: ["organizationId", "type", "_creationTime"];
      parentId: ["parentId", "_creationTime"];
      parentId_sortOrder: ["parentId", "sortOrder", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  property: {
    document: {
      config?:
        | null
        | { type: "title" }
        | { type: "text" }
        | { type: "date" }
        | { type: "person" }
        | { type: "files" }
        | { type: "checkbox" }
        | { type: "url" }
        | { type: "email" }
        | { type: "phone" }
        | { type: "created_time" }
        | { type: "created_by" }
        | { type: "last_edited_time" }
        | { type: "last_edited_by" }
        | {
            options: Array<{ color?: string; id: string; name: string }>;
            type: "select";
          }
        | {
            options: Array<{ color?: string; id: string; name: string }>;
            type: "multi_select";
          }
        | {
            groups: Array<{ color?: string; id: string; name: string }>;
            options: Array<{ color?: string; id: string; name: string }>;
            type: "status";
          }
        | {
            numberFormat:
              | "number"
              | "dollar"
              | "euro"
              | "pound"
              | "baht"
              | "yen"
              | "percent"
              | "rupee"
              | "won"
              | "ruble";
            type: "number";
          }
        | { expression: string; type: "formula" }
        | {
            relationDatabaseId: Id<"database">;
            syncedPropertyId?: string;
            type: "relation";
          }
        | {
            relationPropertyId: string;
            rollupFunction:
              | "count"
              | "count_values"
              | "sum"
              | "average"
              | "min"
              | "max"
              | "median"
              | "percent_empty"
              | "percent_not_empty"
              | "show_original"
              | "show_unique";
            rollupPropertyId: string;
            type: "rollup";
          };
      createdAt?: number;
      databaseId: Id<"database">;
      isHidden: boolean;
      isPrimary: boolean;
      name: string;
      sortOrder: string;
      type:
        | "title"
        | "text"
        | "number"
        | "select"
        | "multi_select"
        | "status"
        | "date"
        | "person"
        | "files"
        | "checkbox"
        | "url"
        | "email"
        | "phone"
        | "formula"
        | "relation"
        | "rollup"
        | "created_time"
        | "created_by"
        | "last_edited_time"
        | "last_edited_by";
      updatedAt?: null | number;
      _id: Id<"property">;
      _creationTime: number;
    };
    fieldPaths:
      | "config"
      | "config.expression"
      | "config.groups"
      | "config.numberFormat"
      | "config.options"
      | "config.relationDatabaseId"
      | "config.relationPropertyId"
      | "config.rollupFunction"
      | "config.rollupPropertyId"
      | "config.syncedPropertyId"
      | "config.type"
      | "createdAt"
      | "_creationTime"
      | "databaseId"
      | "_id"
      | "isHidden"
      | "isPrimary"
      | "name"
      | "sortOrder"
      | "type"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      databaseId: ["databaseId", "_creationTime"];
      databaseId_type: ["databaseId", "type", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  ratelimit_dynamic_limit: {
    document: {
      limit: number;
      prefix: string;
      updatedAt: number;
      _id: Id<"ratelimit_dynamic_limit">;
      _creationTime: number;
    };
    fieldPaths: "_creationTime" | "_id" | "limit" | "prefix" | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_prefix: ["prefix", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  ratelimit_protection_hit: {
    document: {
      blockedUntil?: null | number;
      hits: number;
      kind: "identifier" | "ip" | "userAgent" | "country";
      prefix: string;
      updatedAt: number;
      value: string;
      _id: Id<"ratelimit_protection_hit">;
      _creationTime: number;
    };
    fieldPaths:
      | "blockedUntil"
      | "_creationTime"
      | "hits"
      | "_id"
      | "kind"
      | "prefix"
      | "updatedAt"
      | "value";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_prefix: ["prefix", "_creationTime"];
      by_prefix_value_kind: ["prefix", "value", "kind", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  ratelimit_state: {
    document: {
      auxTs?: null | number;
      auxValue?: null | number;
      key?: null | string;
      name: string;
      shard: number;
      ts: number;
      value: number;
      _id: Id<"ratelimit_state">;
      _creationTime: number;
    };
    fieldPaths:
      | "auxTs"
      | "auxValue"
      | "_creationTime"
      | "_id"
      | "key"
      | "name"
      | "shard"
      | "ts"
      | "value";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_name_key: ["name", "key", "_creationTime"];
      by_name_key_shard: ["name", "key", "shard", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  session: {
    document: {
      activeOrganizationId?: null | string;
      createdAt?: number;
      expiresAt: number;
      ipAddress?: null | string;
      token: string;
      updatedAt?: null | number;
      userAgent?: null | string;
      userId: Id<"user">;
      _id: Id<"session">;
      _creationTime: number;
    };
    fieldPaths:
      | "activeOrganizationId"
      | "createdAt"
      | "_creationTime"
      | "expiresAt"
      | "_id"
      | "ipAddress"
      | "token"
      | "updatedAt"
      | "userAgent"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_expiresAt: ["expiresAt", "_creationTime"];
      by_expiresAt_userId: ["expiresAt", "userId", "_creationTime"];
      by_token: ["token", "_creationTime"];
      by_userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  user: {
    document: {
      createdAt?: number;
      email: string;
      emailVerified: boolean;
      image?: null | string;
      name: string;
      updatedAt?: null | number;
      _id: Id<"user">;
      _creationTime: number;
    };
    fieldPaths:
      | "createdAt"
      | "_creationTime"
      | "email"
      | "emailVerified"
      | "_id"
      | "image"
      | "name"
      | "updatedAt";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_email: ["email", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  verification: {
    document: {
      createdAt?: number;
      expiresAt: number;
      identifier: string;
      updatedAt?: null | number;
      value: string;
      _id: Id<"verification">;
      _creationTime: number;
    };
    fieldPaths:
      | "createdAt"
      | "_creationTime"
      | "expiresAt"
      | "_id"
      | "identifier"
      | "updatedAt"
      | "value";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      by_expiresAt: ["expiresAt", "_creationTime"];
      by_identifier: ["identifier", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
};

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * An identifier for a document in Convex.
 *
 * Convex documents are uniquely identified by their `Id`, which is accessible
 * on the `_id` field. To learn more, see [Document IDs](https://docs.convex.dev/using/document-ids).
 *
 * Documents can be loaded using `db.get(tableName, id)` in query and mutation functions.
 *
 * IDs are just strings at runtime, but this type can be used to distinguish them from other
 * strings when type checking.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Id<TableName extends TableNames | SystemTableNames> =
  GenericId<TableName>;
