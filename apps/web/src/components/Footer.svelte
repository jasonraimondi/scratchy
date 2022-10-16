<script lang="ts">
  import { currentUserStore } from "$lib/auth/current_user";
  import DebugBar from "$ui/debug_bar/DebugBar.svelte";

  const isDebug = Number(import.meta.env.VITE_ENABLE_DEBUG) === 1;
</script>

<footer>
  <section class="main">
    <ul>
      <li class="title">User</li>
      {#if $currentUserStore}
        <li><a href="/app">Dashboard</a></li>
        <li><a href="/app/profile">Profile</a></li>
        <li><a href="/logout">Logout</a></li>
      {:else}
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
        <li><a href="/forgot_password">Forgot Password</a></li>
      {/if}
    </ul>

    {#if $currentUserStore}
      <ul>
        <li class="title">My Stuff</li>
        {#if $currentUserStore.isAdmin}
          <li><a href="/admin">Admin</a></li>
        {/if}
      </ul>
    {/if}

    <ul>
      <li class="title">App</li>
      <li><a href="/books">Books</a></li>
      <li><a href="/users">Users</a></li>
    </ul>
  </section>

  <ul class="bottom">
    <li class="copyright">&copy; {import.meta.env.VITE_APP} {new Date().getFullYear()}</li>
    <li><a href="/privacy_policy">Privacy Policy</a></li>
    <li><a href="/terms_of_service">Terms of Service</a></li>
    {#if isDebug}<li><DebugBar /></li>{/if}
  </ul>
</footer>

<style lang="postcss">
  footer {
    padding: 1rem 1rem 0.5rem;
    background-color: var(--colors-black);
    color: var(--colors-gray-400);

    @media (--xsmall) {
      padding: 2rem 2rem 1rem;
    }
  }

  li {
    padding-bottom: 0.25rem;
  }

  .main {
    display: flex;
    flex-direction: column;
    padding-bottom: 2rem;

    ul {
      margin-top: 1em;
    }

    @media (--xsmall) {
      flex-direction: row;
      ul {
        margin-left: 4rem;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  footer a {
    color: var(--colors-gray-400);

    &:hover {
      color: var(--colors-gray-200);
    }
  }

  .title {
    color: var(--colors-gray-200);
    font-weight: var(--font-bold);
    font-size: 1.25em;
    padding-bottom: 0.75rem;
  }

  .copyright {
    padding-right: 1rem;
  }

  .bottom {
    display: flex;
    flex-direction: column;
    font-size: 0.7em;

    @media (--xsmall) {
      flex-direction: row;

      li {
        margin-left: 0.5em;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
</style>
