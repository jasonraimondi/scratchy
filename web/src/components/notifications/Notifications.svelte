<script lang="ts">
  import { fly } from "svelte/transition";
  import type { Notify } from "$ui/notifications/notifications.types";
  import { notify } from "$ui/notifications/notification.service";

  let notifications: Notify[] = [];
  notify.messageList$.subscribe(n => (notifications = Object.values(n)));
</script>

{#if notifications.length}
  <ul class="list">
    {#each notifications as notification}
      <li transition:fly={{ x: 100, duration: 200 }} on:click={() => notify.clear(notification.id)} class={`item ${notification.type}`}>
        <div class="message-container ${notification.type}">
          {#if notification.title}<span class="title">{notification.title}</span>{/if}
          <span class="message">{notification.message}</span>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  .list {
    z-index: 100;
    margin: 0;
    padding: 0;
    position: fixed;
    top: 2.5em;
    right: 50%;
    left: 50%;
    font-size: var(--text-md);
    font-weight: var(--font-bold);
    color: var(--colors-white);

    @media (--xsmall) {
      left: initial;
      width: 350px;
    }
  }

  .item {
    width: 100%;
    border-radius: var(--theme-border-radius);
    font-weight: inherit;
    display: flex;
    margin-bottom: 0.5rem;

    word-break: break-all;
  }

  .message-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5em;
  }

  .title {
    font-size: 105%;
    font-weight: var(--font-bold);
  }

  .message {
    font-size: var(--text-md);
    font-weight: var(--font-medium);
  }

  .info {
    background-color: var(--theme-info);
    border-color: var(--theme-info-hover);
    &:hover {
      background-color: var(--theme-info-hover);
    }
  }

  .success {
    background-color: var(--theme-success);
    border-color: var(--theme-success-hover);
    &:hover {
      background-color: var(--theme-success-hover);
    }
  }

  .error {
    background-color: var(--theme-error);
    border-color: var(--theme-error-hover);
    &:hover {
      background-color: var(--theme-error-hover);
    }
  }
</style>
