# Lanes — deviations from master

- Density rises to 7/10. This is the one route that behaves like an operations tool.
- Rows are hairline separated, 72px tall on desktop, and expand to a two-line stack below `md`.
  Each row carries a 96×28 sparkline that shares the chart's colour encoding.
- Filters are client side over a small dataset, so results update on the same frame as the input.
  No skeleton appears for filtering; the skeleton in `loading.tsx` covers the first server fetch.
- Empty state replaces the table with a labelled message and a reset control, never a blank area.
- Detail page: the header block reuses the row's typography so the drill transition reads as the
  row expanding into a page.
