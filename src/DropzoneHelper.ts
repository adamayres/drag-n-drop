import accepts from "attr-accept";

interface DropzoneStateWithClasses {
  isDragWouldAccept: boolean;
  isDragging: boolean;
}

function isDefined(value: any) {
  return value !== undefined && value !== null;
}

export const FILE_INVALID_TYPE = "file-invalid-type";
export const FILE_TOO_LARGE = "file-too-large";
export const FILE_TOO_SMALL = "file-too-small";
// export const TOO_MANY_FILES = 'too-many-files';

export const getTooLargeRejectionError = (maxSize: any) => {
  return {
    code: FILE_TOO_LARGE,
    message: `File is larger than ${maxSize} bytes`
  };
};

export const getTooSmallRejectionError = (minSize: any) => {
  return {
    code: FILE_TOO_SMALL,
    message: `File is smaller than ${minSize} bytes`
  };
};

export const getInvalidTypeRejectionError = (accept: any) => {
  const localAccept =
    Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
  const messageSuffix = Array.isArray(localAccept)
    ? `one of ${localAccept.join(", ")}`
    : localAccept;
  return {
    code: FILE_INVALID_TYPE,
    message: `File type must be ${messageSuffix}`
  };
};

export function fileMatchSize(file: any, minSize: any, maxSize: any) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) {
        return [false, getTooLargeRejectionError(maxSize)];
      }
      if (file.size < minSize) {
        return [false, getTooSmallRejectionError(minSize)];
      }
    } else if (isDefined(minSize) && file.size < minSize) {
      return [false, getTooSmallRejectionError(minSize)];
    } else if (isDefined(maxSize) && file.size > maxSize) {
      return [false, getTooLargeRejectionError(maxSize)];
    }
  }
  return [true, null];
}

export function fileAccepted(file: any, accept: any,) {
  const isAcceptable =
    file.type === "application/x-moz-file" || accepts(file, accept);
  return [
    isAcceptable,
    isAcceptable ? null : getInvalidTypeRejectionError(accept)
  ];
}

export function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles
}: any) {
  if (
    (!multiple && files.length > 1) ||
    (multiple && maxFiles >= 1 && files.length > maxFiles)
  ) {
    return false;
  }

  return files.every((file: any) => {
    const [accepted] = fileAccepted(file, accept);
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
    return accepted && sizeMatch;
  });
}
