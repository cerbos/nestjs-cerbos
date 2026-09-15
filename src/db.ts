// This is just a fake document repository/db. The `getDocumentAttributes()`
// query is for when we only want the minimal attribute information to pass
// to Cerbos for an authorization check.
export type Document = {
  id: string;
  title: string;
  author: string;
  description: string;
  icon: string;
};

const documents: Document[] = [
  {
    id: '1',
    title: 'Secret Admin Document',
    author: 'admin',
    description:
      "Congratulations! You've successfully accessed the admin only resource route.",
    icon: '🔒',
  },
  {
    id: '2',
    title: 'My Very Important Document',
    author: 'user',
    description:
      "This document is available to the author and any user with the 'admin' role.",
    icon: '🔓',
  },
  {
    id: '3',
    title: 'A Document',
    author: 'not-the-current-user',
    description:
      "This document is available to its author and any user with the 'admin' role.",
    icon: '🔒',
  },
];

export const getDocuments = (): Document[] => documents;

export const getDocumentById = async (
  id: string,
): Promise<Document | undefined> => documents.find((doc) => doc.id === id);

export const getDocumentAttributes = async () =>
  documents.map((doc) => ({ id: doc.id, author: doc.author }));

export const getDocumentAttributesById = async (id?: string) =>
  (await getDocumentAttributes()).find((doc) => doc.id === id);
