<script lang="ts">
  import type { User } from "@modules/web-api-client/src/generated/graphql";

  export let user: User;
</script>

<div>
  <img src={user.gravatar} alt="{user.nickname}'s avatar" />
  <h2>{user.nickname}</h2>
  <p>{user.email}</p>
</div>

<style>
  div {
    border: 1px solid black;
    padding: 1rem;
    display: inline-block;
  }
</style>
