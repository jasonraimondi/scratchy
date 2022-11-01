<script lang="ts">
  import { currentUserStore } from "$lib/auth/current_user";
</script>

<header>
  <nav class="nav">
    <ul class="left">
      <li><a href="/" data-test="link--home">Home</a></li>
      {#if $currentUserStore?.isAdmin}<li><a href="/admin" data-test="link--admin" style="color: var(--colors-red-500);">Admin</a></li>{/if}
    </ul>
    <ul class="right">
      {#if $currentUserStore}
        <li><a href="/app" data-test="link--dashboard">Dashboard</a></li>
        <li><a href="/app/profile" data-test="link--profile">Profile</a></li>
        <li><a href="/logout" data-test="link--logout">Logout</a></li>
      {:else}
        <li><a href="/register" data-test="link--register">Register</a></li>
        <li><a href="/login" data-test="link--login">Login</a></li>
      {/if}
    </ul>
  </nav>
</header>

<style lang="postcss">
  header {
    overflow-x: auto;
  }
  .nav {
    border-bottom: 1px solid var(--colors-gray-400);
    display: flex;
  }

  .left {
    flex: 1;
  }

  .left,
  .right {
    margin: 0.4em;
    display: flex;
    li {
      margin-right: 1em;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
