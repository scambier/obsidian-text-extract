import { pdfManager } from './pdf-manager'
import { ocrManager } from './ocr-manager'
import { ocrLangs } from './ocr-langs'
import type { TFile } from 'obsidian'
import type { OcrOptions } from './types'
import { processQueue } from './globals'

/**
 * Returns a promise that resolves to the text extracted from the file.
 * On mobile, if the text is not already extracted and cached, will return an empty string.
 * Will throw an error if the file type is not supported; check canFileBeExtracted() first.
 * @param file
 * @returns
 */
function extractText(
  file: TFile,
  options?: Partial<OcrOptions>
): Promise<string> {
  const opts = Object.assign({}, { langs: ['eng'] }, options)

  if (isFilePDF(file.path)) {
    return pdfManager.getPdfText(file)
  } else if (isFileImage(file.path)) {
    return ocrManager.getImageText(file, opts)
  }
  throw new Error('File type not supported')
}

function isFilePDF(path: string): boolean {
  return path.endsWith('.pdf')
}

function isFileImage(path: string): boolean {
  return (
    path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')
  )
}

/**
 * Returns true if the filepath is a supported file type.
 * @param filePath
 * @returns
 */
function canFileBeExtracted(filePath: string): boolean {
  return isFilePDF(filePath) || isFileImage(filePath)
}

/**
 * Returns the list of supported languages for OCR
 */
function getOcrLangs() {
  return ocrLangs
}

/**
 * Clears the process queue.
 * This stops any pending text extraction.
 */
function clearProcessQueue() {
  processQueue.clear()
}

export { extractText, getOcrLangs, canFileBeExtracted, clearProcessQueue }
