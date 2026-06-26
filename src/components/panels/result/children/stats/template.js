export const template = /* HTML */ `
  <dl class="stats">
    <div class="stat-row">
      <dt class="stat-label">Temperature</dt>
      <dd class="stat-value" id="temperature"></dd>
    </div>
    <div class="stat-row">
      <dt class="stat-label">Feels like (heat index)</dt>
      <dd class="stat-value" id="heat-index"></dd>
    </div>
    <div class="stat-row">
      <dt class="stat-label">Humidity</dt>
      <dd class="stat-value" id="humidity"></dd>
    </div>
    <div class="stat-row">
      <dt class="stat-label">30yr seasonal mean</dt>
      <dd class="stat-value" id="temp-mean"></dd>
    </div>
    <div class="stat-row">
      <dt class="stat-label">Typical variation</dt>
      <dd class="stat-value" id="temp-std"></dd>
    </div>
  </dl>
`;
