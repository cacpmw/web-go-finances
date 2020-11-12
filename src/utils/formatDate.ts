function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: '2-digit',
    
  }).format(value);
}

export default formatDate;
