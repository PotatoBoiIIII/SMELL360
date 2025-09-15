<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';  
  let map;
  let mapContainer;
  let modalOpen = $state(false);
  let showModal = $state(false)
  let modalContent = $state('');
  let markerColor = $state('#000000');
  let numMarkers = 0;
  let color = $state('');
  let openPost = $state(false);

  // openPost = false;

  function openModalPost(col){
    openPost = !openPost;
    numMarkers = 1000;
    markerColor= col;
  }
  function openModal(content,ide,col){
    showModal=!showModal;
    modalContent=content;
    id=ide;
    color = col
  } 
  let markers = [
    {id:1, lng:100, lat:100},
    {id:2, lng:100, lat:100},
  ];
  let id = $state(0);
  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer, // container id or element
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH', // basic open style
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
    });
     map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      openModalPost(markerColor);
      const marker = new maplibregl.Marker({color:markerColor})
        .setLngLat([lng, lat])
        .addTo(map);
      const mcolor = markerColor;
      markers.push({id:10,lng:lng,lat:lat})
      numMarkers+=1
      const markerElement = marker.getElement();
      markerElement.id=numMarkers.toString();
      markerElement.addEventListener('click', (event) => {
      event.stopPropagation();
      const content = `Marker at [${lng.toFixed(4)}, ${lat.toFixed(4)}]`;
      
      openModal( content, markerElement.id,mcolor);
    });
    });

    return () => {
      map.remove(); // cleanup on component destroy
    };
  });
  
</script>
<Modal bind:showModal>
  {#snippet header()}
		<h2>
			{modalContent} color: {color}
		</h2>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      Author:
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      Description:
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      Type: {color}
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      ID: {id}
 
    </h1>
	{/snippet}

</Modal>
<Modal bind:showModal={openPost}>
  {#snippet header()}
		<h1>this is an input field to create a post</h1>
	{/snippet}

</Modal>
<button onclick={() => (markerColor="#00FFFF")}> blue </button>
<button onclick={() => (markerColor="#00000")}> black </button>
<button onclick={() => (markerColor="#FF0000")}> red </button>

<style>
  #map {
    width: 100%;
    height: 800px;
  }
  #maplibregl-marker {
  background-image: url('https://cdn.maptiler.com/maplibre-gl-js/v1.15.2/img/marker-icon.png');
  background-size: cover;
  width: 30px;
  height: 40px;
  cursor: pointer;
}
h1{
  color:aqua;
  font:bold
}

</style>

<div bind:this={mapContainer} id="map"></div>
