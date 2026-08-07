import type { CvOption } from "../data/cv";

function isShareCancellation(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function downloadCvFallback(cv: CvOption) {
  const link = document.createElement("a");
  link.href = cv.path;
  link.download = cv.filename;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.click();
}

export async function shareCv(cv: CvOption) {
  const resumeUrl = new URL(cv.path, window.location.href).href;
  const shareDetails = {
    title: `Nicholas Nguyen — ${cv.title}`,
    text: `Nicholas Nguyen's ${cv.title.toLowerCase()}`,
  };

  if (!navigator.share) {
    downloadCvFallback(cv);
    return;
  }

  if (navigator.canShare) {
    try {
      const response = await fetch(cv.path);
      if (!response.ok) throw new Error("Unable to load the CV");

      const resumeFile = new File([await response.blob()], cv.filename, {
        type: "application/pdf",
      });
      const fileShare = { ...shareDetails, files: [resumeFile] };

      if (navigator.canShare(fileShare)) {
        try {
          await navigator.share(fileShare);
          return;
        } catch (error) {
          if (isShareCancellation(error)) return;
        }
      }
    } catch (error) {
      if (isShareCancellation(error)) return;
    }
  }

  try {
    await navigator.share({ ...shareDetails, url: resumeUrl });
  } catch (error) {
    if (!isShareCancellation(error)) downloadCvFallback(cv);
  }
}
