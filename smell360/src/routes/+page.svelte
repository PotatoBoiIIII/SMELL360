<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';

  let map;
  let mapContainer;

  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer, // container id or element
      style: 'https://demotiles.maplibre.org/style.json', // basic open style
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
    });

    return () => {
      map.remove(); // cleanup on component destroy
    };
  });
</script>

<style>
  #map {
    width: 100%;
    height: 400px;
  }
</style>

<div bind:this={mapContainer} id="map"></div>
