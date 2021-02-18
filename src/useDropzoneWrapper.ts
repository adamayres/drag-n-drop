import { useState, useEffect } from "react";
import { fromEvent } from "file-selector";
import { allFilesAccepted } from "./DropzoneHelper";
import { DropzoneOptions } from "react-dropzone";

export interface DropzoneWrapperState {
  isDragging: boolean;
  isDragWouldAccept: boolean;
}

export default function useDropzoneWrapper(
  options?: DropzoneOptions
): DropzoneWrapperState {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragWouldAccept, setIsDragWouldAccept] = useState<boolean>(true);
  const { accept, minSize, maxSize, multiple, maxFiles } = options ?? {};

  function resetDragState() {
    console.log("reset", isDragging);
    if (isDragging) {
      setIsDragging(false);
      setIsDragWouldAccept(false);
    }
  }

  useEffect(() => {
    async function handleDragEnter(event: any) {
      if (event.target !== event.relatedTarget && !isDragging) {
        console.log("set dragging");
        setIsDragging(true);

        event.preventDefault();
        event.stopPropagation(event);
        const draggedFiles = await fromEvent(event);

        const fileCount = draggedFiles.length;
        const isDragAcceptGlobal =
          fileCount > 0 &&
          allFilesAccepted({
            files: draggedFiles,
            accept,
            minSize,
            maxSize,
            multiple,
            maxFiles
          });
        setIsDragWouldAccept(isDragAcceptGlobal);
      }
    }

    function handleDragLeave(event: any) {
      console.log("drag leave");
      if (!event.relatedTarget) {
        resetDragState();
      }
    }

    document.body.addEventListener("dragenter", handleDragEnter);
    document.body.addEventListener("dragleave", handleDragLeave);
    document.body.addEventListener("drop", resetDragState);

    return () => {
      document.body.removeEventListener("dragenter", handleDragEnter);
      document.body.removeEventListener("dragleave", handleDragLeave);
      document.body.removeEventListener("drop", resetDragState);
    };
  });

  return {
    isDragWouldAccept,
    isDragging
  };
}
