<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let text: string | undefined;
  const dispatch = createEventDispatcher<{ copy: string; fail: never }>();
  const copy = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(
        () => dispatch("copy", text),
        _e => dispatch("fail"),
      );
    }
  };
</script>

<slot {copy} />
