import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const polly  = new PollyClient({});
const s3     = new S3Client({});
const dynamo = new DynamoDBClient({});

const { BUCKET_NAME, TABLE_NAME } = process.env;

export const handler = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub;
  const method = event.requestContext.http.method;

  if (method === "POST") return synthesize(userId, JSON.parse(event.body || "{}"));
  if (method === "GET")  return getHistory(userId);

  return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
};

async function synthesize(userId, { text, voiceId = "Joanna" }) {
  if (!text || typeof text !== "string" || text.trim().length === 0)
    return { statusCode: 400, body: JSON.stringify({ error: "text is required" }) };

  if (text.length > 3000)
    return { statusCode: 400, body: JSON.stringify({ error: "text exceeds 3000 character limit" }) };

  const pollyRes = await polly.send(new SynthesizeSpeechCommand({
    Text:         text,
    VoiceId:      voiceId,
    OutputFormat: "mp3",
    Engine:       "neural",
  }));

  const audioBytes = await pollyRes.AudioStream.transformToByteArray();
  const s3Key      = `audio/${userId}/${randomUUID()}.mp3`;
  const createdAt  = new Date().toISOString();

  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET_NAME,
    Key:         s3Key,
    Body:        audioBytes,
    ContentType: "audio/mpeg",
  }));

  await dynamo.send(new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      userId:      { S: userId },
      createdAt:   { S: createdAt },
      s3Key:       { S: s3Key },
      textSnippet: { S: text.substring(0, 100) },
      voiceId:     { S: voiceId },
    },
  }));

  const audioUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key }),
    { expiresIn: 3600 }
  );

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioUrl, s3Key, createdAt }),
  };
}

async function getHistory(userId) {
  const result = await dynamo.send(new QueryCommand({
    TableName:                 TABLE_NAME,
    KeyConditionExpression:    "userId = :uid",
    ExpressionAttributeValues: { ":uid": { S: userId } },
    ScanIndexForward:          false,
    Limit:                     20,
  }));

  const items = (result.Items || []).map((i) => ({
    createdAt:   i.createdAt.S,
    textSnippet: i.textSnippet.S,
    voiceId:     i.voiceId.S,
    s3Key:       i.s3Key.S,
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  };
}
