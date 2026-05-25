export enum ArticleStatus {
  Publier = 'Publier',
  Brouillon = 'Brouillon',
  EnAttente = 'EnAttente',        // Soumis par le journaliste, en attente de validation cellule media
  EnRevision = 'EnRevision',      // Renvoyé pour corrections cellule de validation
  Valider = 'Valider',            // Validé par cellule validation (prêt à publier)
  Refuse = 'Refuse',
}