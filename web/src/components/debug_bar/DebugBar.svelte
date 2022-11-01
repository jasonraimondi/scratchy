<script lang="ts">
  import { currentUserStore } from "$lib/auth/current_user";
  import { notify } from "$ui/notifications/notification.service";
  import CopyToClipboard from "$ui/CopyToClipboard.svelte";

  let showDebugBar = false;

  const handleSuccessfullyCopied = () => {
    notify.success({
      title: "Successfully copied to clipboard",
      message: $currentUserStore?.id ?? "unknown",
      ttl: 1000,
    });
  };

  const handleFailedCopy = () => {
    notify.error("failed to copy :(");
  };

  const toggleShow = () => (showDebugBar = !showDebugBar);
</script>

<button on:click={toggleShow}>Toggle Debug</button>

{#if showDebugBar}
  <div class="debug-bar">
    <article>
      <button on:click={toggleShow}>&times; Close</button>
    </article>
    <article class="debug-notify">
      <button class="info" on:click={() => notify.info("This is my info")}>&nbsp;</button>
      <button class="success" on:click={() => notify.success("This is my Woah")}>&nbsp;</button>
      <button
        class="error"
        on:click={() =>
          notify.error({
            message: "This is an error",
            ttl: 150000,
          })}
        >&nbsp;
      </button>
    </article>
    <CopyToClipboard
      text={$currentUserStore?.id}
      on:copy={handleSuccessfullyCopied}
      on:fail={handleFailedCopy}
      let:copy
    >
      <p on:click={copy} on:keydown={() => {}}>
        <strong>Auth User:</strong>{$currentUserStore?.email ?? ""}
        <br />
        <span>{$currentUserStore?.id}</span>
      </p>
    </CopyToClipboard>
  </div>
{/if}

<style lang="postcss">
  .debug-bar {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    align-items: center;
    background-color: var(--colors-violet-200);
    overflow-x: auto;
    padding: 0.5rem;
    min-width: 250px;
    color: var(--colors-black);
  }

  button {
    margin: 0.4em 0.2em;
  }
</style>
