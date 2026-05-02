# Sobre as imagens

O arquivo `images.js` atual usa **placeholders SVG** enquanto as imagens aquarela reais não estão disponíveis nesta sessão.

## Para adicionar suas imagens reais:

O arquivo que você enviou usa `window.__RASTRO_IMG__` como objeto global.
Para integrar com o projeto React (que usa ES modules), faça assim:

1. Abra o arquivo `images.js` que você tem
2. Copie o conteúdo do objeto (as chaves icon, cliffs, beach, lighthouse, abstract, objects, fish, balloon, map)
3. Substitua o conteúdo de `src/lib/images.js` por:

```javascript
// Cole aqui o conteúdo do seu arquivo de imagens
const IMG = {
  icon: "data:image/jpeg;base64,...",    // cole o valor
  cliffs: "data:image/jpeg;base64,...",   // cole o valor
  beach: "data:image/jpeg;base64,...",    // (era "island" no seu arquivo?)
  lighthouse: "data:image/jpeg;base64,...",
  abstract: "data:image/jpeg;base64,...",
  objects: "data:image/jpeg;base64,...",
  fish: "data:image/jpeg;base64,...",
  balloon: "data:image/jpeg;base64,...",
  map: "data:image/jpeg;base64,...",
}
export default IMG
```

## Chaves que vi no seu arquivo:
- `icon` ✓
- `cliffs` ✓  
- `island` → renomear para `beach` (ou verificar qual é a praia)
- `abstract` ✓
- (verificar as demais)
