<script lang="ts">
  import { currentUserStore } from "$lib/auth/current_user";
</script>

<header class="container center padded">
  <nav class="nav">
    <ul class="left">
      <li><a href="/" data-test="link--home">Home</a></li>
      {#if $currentUserStore}
        <li><a href="/app/dashboard" data-test="link--dashboard">Dashboard</a></li>
        <li><a href="/app/profile" data-test="link--profile">Profile</a></li>
      {:else}
      {/if}
    </ul>
    <ul class="right">
      {#if $currentUserStore}
        <li><a href="/logout" data-test="link--logout">Logout</a></li>
      {:else}
        <li><a href="/register" data-test="link--register">Register</a></li>
        <li><a href="/login" data-test="link--login">Login</a></li>
      {/if}
    </ul>
  </nav>
</header>

<style lang="postcss">
    .nav {
        display: flex;
        padding: 0 0 0.5em;
        margin-bottom: 0.5em;
        border-bottom: 1px solid var(--colors-gray-400);
    }

    .left {
        flex: 1;
    }

    .left,
    .right {
        display: flex;
        li {
            margin-right: 1em;
            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>