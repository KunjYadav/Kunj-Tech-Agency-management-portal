/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import axios from "axios";
import { FileUp, File, Download, Loader2 } from "lucide-react";

const API_URL = "/api";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;

export default function ProjectFiles({
  projectId,
  initialFiles,
  onUploadSuccess,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `${API_URL}/projects/${projectId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      setFile(null);
      e.target.reset();
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (error) {
      alert("Failed to upload file. Check console.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSecureDownload = async (fileData) => {
    setDownloadingId(fileData._id);
    try {
      const path = fileData.path || "";
      const fileUrl = path.startsWith("/api") ? path : `${API_URL}${path}`;
      const response = await axios.get(fileUrl, {
        responseType: "blob",
        withCredentials: true,
      });

      if (response.data.type === "application/json") {
        const errorText = await response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || "Server denied the download.");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileData.filename);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Error Details:", error);

      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorText = await error.response.data.text();
          const errorJson = JSON.parse(errorText);
          alert(`Download blocked: ${errorJson.message}`);
        } catch (e) {
          alert("Download failed. The file may be missing from the database.");
        }
      } else {
        alert(error.message || "An unexpected error occurred during download.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className='bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm'>
      <h3 className='text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2'>
        <FileUp size={16} /> Secure Attachments
      </h3>

      <form
        onSubmit={handleUpload}
        className='flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-2xl'
      >
        <input
          type='file'
          className='flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all outline-none cursor-pointer'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          disabled={!file || uploading}
          className='bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50'
        >
          {uploading ? (
            <Loader2 size={16} className='animate-spin' />
          ) : (
            "Upload"
          )}
        </button>
      </form>

      {/* FIX: Added max-h-[350px] and overflow-y-auto so the files scroll neatly inside the box */}
      <div className='space-y-3 max-h-87.5 overflow-y-auto pr-2'>
        {initialFiles?.length > 0 ? (
          initialFiles.map((f) => (
            <div
              key={f._id}
              className='flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group'
            >
              <div className='flex items-center gap-3 overflow-hidden'>
                <div className='w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0'>
                  <File size={20} />
                </div>
                <div className='truncate'>
                  <p className='text-sm font-bold text-slate-800 truncate'>
                    {f.filename}
                  </p>
                  <p className='text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5'>
                    By {f.uploadedBy?.name || "Unknown"} •{" "}
                    {new Date(f.uploadedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSecureDownload(f)}
                disabled={downloadingId === f._id}
                className='p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all disabled:opacity-50'
                title='Download Secure File'
              >
                {downloadingId === f._id ? (
                  <Loader2 size={18} className='animate-spin' />
                ) : (
                  <Download size={18} />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className='text-center text-xs font-bold text-slate-400 uppercase tracking-widest py-6 border-2 border-dashed border-slate-100 rounded-2xl'>
            No files attached yet.
          </p>
        )}
      </div>
    </div>
  );
}
