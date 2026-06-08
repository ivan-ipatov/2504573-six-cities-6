export interface DocumentOwner {
  getOwnerId(documentId: string): Promise<string | null>;
}
