<script>
  let { showModal = $bindable(), header, children } = $props();

  let dialog = $state(); // HTMLDialogElement
  let closing = $state(false); // Track the closing state
  const DURATION = 700; // Animation duration in ms (2s)

  $effect(() => {
    if (showModal) {
      // --- OPENING LOGIC ---
      closing = false;
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (!showModal && dialog.open && !closing) {
      // --- CLOSING LOGIC ---
      closing = true; // 1. Add the .closing class (triggers CSS fade-out)

      // 2. Wait for the animation to finish
      setTimeout(() => {
        if (dialog) {
          dialog.close(); // 3. *Then* actually close the dialog
        }
        closing = false;
      }, DURATION); // <-- This MUST match your CSS transition duration
    }
  });
</script>

<dialog
  bind:this={dialog}
  class:closing={closing}
  onclose={() => (showModal = false)}
  onclick={(e) => {
    if (e.target === dialog) {
      showModal = false; // <-- CHANGE THIS
    }
  }}
>
  <div style="height: 80vh; width: 50vw">
    {@render header?.()}
    <hr />
    {@render children?.()}

    <button autofocus onclick={() => (showModal = false)}>close modal</button>
  </div>
</dialog>

<style>
  :global(dialog) {
    max-width: 100em;
    width: 50vw;
    border-radius: 0.2em;
    border: none;
    padding: 10px;
    background: black;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    height: 85vh;
    border-radius: 5%;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :global(dialog)::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }

  /* --- BACKDROP TRANSITION --- */
  :global(dialog::backdrop) {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    opacity: 0;
    /* Set your desired duration (e.g., 2s) */
    transition: opacity 1s ease-out;
  }

  :global(dialog[open]::backdrop) {
    opacity: 1; /* Fade-in state */
  }

  /* ADD THIS: Fade-out state for backdrop */
  :global(dialog.closing::backdrop) {
    opacity: 0;
  }

  /* --- MODAL CONTENT TRANSITION --- */
  :global(dialog > div) {
    padding: 1.5em;
    background: #000000;
    border-radius: 0.2em;
    box-sizing: border-box;

    /* Start hidden */
    opacity: 0;
    transform: scale(0.9);

    /* Set your desired duration (e.g., 2s) */
    transition: opacity 1s ease-out, transform 1s ease-out;
  }

  :global(dialog[open] > div) {
    /* End visible (fade-in state) */
    opacity: 1;
    transform: scale(1);
  }

  /* ADD THIS: Fade-out state for content */
  :global(dialog.closing > div) {
    opacity: 0;
    transform: scale(0.9);
  }

  /* --- OTHER STYLES --- */
  :global(button) {
    display: block;
    margin: 1em auto 0 auto;
    padding: 0.5em 1.2em;
    background-color: #007bff;
    color: rgb(254, 252, 252);
    border: none;
    border-radius: 0.3em;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease; /* Reverted this to 0.2s, 2s seemed long */
  }

  :global(button:hover) {
    background-color: #0056b3;
  }

  @media (max-width: 600px) {
    :global(dialog) {
      width: 90vw;
      padding: 20px;
    }
  }
</style>