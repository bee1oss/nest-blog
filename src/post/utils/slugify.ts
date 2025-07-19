export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD') // Unicode normalize
		.replace(/[\u0300-\u036f]/g, '') // aksanları sil
		.replace(/ç/g, 'c')
		.replace(/ğ/g, 'g')
		.replace(/ı/g, 'i')
		.replace(/ö/g, 'o')
		.replace(/ş/g, 's')
		.replace(/ü/g, 'u')
		.replace(/[^a-z0-9 ]/g, '') // sadece harf ve sayı kalsın
		.trim()
		.replace(/\s+/g, '-') // boşlukları tire ile değiştir
}
