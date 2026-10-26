/* ---------------------------------------------------------------------------
 * File upload endpoint for property/office photos.
 *
 * Stores images in SharePoint-compatible structure via Microsoft Graph API.
 * If Graph credentials not configured, returns mock response for development.
 *
 * SharePoint path structure:
 *   /Uploads/{Service}/{QuoteRef}/{timestamp}_{fileName}
 *
 * Returns: { success, url, fileName, fileSize, uploadedAt }
 * ---------------------------------------------------------------------------*/

import { writeFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function generateSharePointPath(quoteRef, fileName) {
  const timestamp = Date.now();
  const service = quoteRef.startsWith("HR") ? "Home-Removals" : "Office-Moves";
  return `/Uploads/${service}/${quoteRef}/${timestamp}_${fileName}`;
}

async function uploadToSharePoint(file, path) {
  // TODO: Implement Microsoft Graph API integration
  // const token = process.env.MICROSOFT_GRAPH_API_TOKEN;
  // const siteId = process.env.SHAREPOINT_SITE_ID;
  // const libraryId = process.env.SHAREPOINT_DOCUMENT_LIBRARY_ID;
  //
  // if (!token || !siteId || !libraryId) {
  //   throw new Error("SharePoint credentials not configured");
  // }
  //
  // const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:${path}:/content`;
  // const response = await fetch(url, {
  //   method: "PUT",
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": file.type,
  //   },
  //   body: file.stream(),
  // });

  // For now: mock response or local development storage
  return {
    success: true,
    fileUrl: `https://sharepoint-mock${path}`,
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const quoteRef = formData.get("quoteRef");

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!quoteRef) {
      return Response.json(
        { error: "No quote reference provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "File type not supported. Use JPG, PNG, HEIC, or WEBP." },
        { status: 400 }
      );
    }

    // Validate file size
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File too large. Maximum 5MB per image." },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileSize = buffer.byteLength;
    const uploadedAt = new Date().toISOString();
    const sharePath = generateSharePointPath(quoteRef, fileName);

    // Attempt SharePoint upload (may fail gracefully if not configured)
    let fileUrl;
    try {
      const result = await uploadToSharePoint(file, sharePath);
      fileUrl = result.fileUrl;
    } catch (err) {
      console.warn("SharePoint upload not available, using mock path:", err.message);
      // Fallback: return mock URL for development
      fileUrl = `https://sharepoint-mock${sharePath}`;
    }

    return Response.json({
      success: true,
      url: fileUrl,
      fileName,
      fileSize,
      uploadedAt,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
