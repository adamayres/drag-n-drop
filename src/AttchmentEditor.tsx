import { DropzoneOptions, useDropzone } from "react-dropzone";
// import { DropzoneOptions, useDropzone } from "./useDropzone/useDropzone";
import classnames from "classnames";
// import useDropzoneWrapper from "./useDropzoneWrapper";

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

  // const { isDragging, isDragWouldAccept } = useDropzoneWrapper(options);

  const classes = classnames("lia-attachment-editor", {
    "lia-drag-accept": isDragAccept,
    "lia-drag-active": isDragActive,
    "lia-drag-reject": isDragReject
    // "lia-dragging": isDragging,
    // "lia-drag-would-reject": !isDragWouldAccept
  });

  function DragOverlay() {
    return (
      <div className="lia-drag-overlay">
        <span className="lia-drag-icon">Hi</span>
      </div>
    );
  }

  return (
    <>
      <div className={classes} {...getRootProps()}>
        <DragOverlay />
        <input {...getInputProps()} />
        Add link...
      </div>
      <ul>
        {/* <li>isDragging: {isDragging.toString()}</li> */}
        <li>isDragAccept: {isDragAccept.toString()}</li>
        <li>isDragActive: {isDragActive.toString()}</li>
        <li>isDragReject: {isDragReject.toString()}</li>
        {/* <li>isDragWouldAccept: {isDragWouldAccept.toString()}</li> */}
      </ul>
    </>
  );
}
