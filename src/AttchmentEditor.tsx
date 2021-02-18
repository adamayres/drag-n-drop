import { DropzoneOptions, useDropzone } from "react-dropzone";
import classnames from "classnames";
import useDropzoneWrapper from "./useDropzoneWrapper";

export default function AttachmentEditor() {
  const options: DropzoneOptions = {
    accept: "image/*"
  };
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject
  } = useDropzone(options);

  const { isDragging, isDragWouldAccept } = useDropzoneWrapper(options);

  const classes = classnames("lia-attachment-editor", {
    "lia-drag-accept": isDragging && isDragAccept,
    "lia-drag-active": isDragging && isDragActive,
    "lia-drag-reject": isDragging && isDragReject,
    "lia-dragging": isDragging,
    "lia-drag-would-reject": isDragging && !isDragWouldAccept
  });

  function DragOverlay() {
    return (
      <div className="lia-drag-overlay">
        <span className="lia-drag-icon">Hi</span>
      </div>
    );
  }

  console.log(classes, isDragging, isDragReject);

  return (
    <div className={classes} {...getRootProps()}>
      {isDragging && <DragOverlay />}
      <input {...getInputProps()} />
      Add link...
    </div>
  );
}
