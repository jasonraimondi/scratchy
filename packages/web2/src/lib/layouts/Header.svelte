<script lang="ts">
  const isAuthenticated = Math.random() > 0.5;

  type MenuItem = {
    name: string;
    href: string;
    dataTest: string;
  };

  const leftMenu: MenuItem[] = [{ name: "Home", href: "/", dataTest: "link--home" }];
  const rightMenu: MenuItem[] = [];

  if (isAuthenticated) {
    leftMenu.push(
      { name: "Dashboard", href: "/app/dashboard", dataTest: "link--dashboard" },
      { name: "Profile", href: "/app/profile", dataTest: "link--profile" },
    );
    rightMenu.push({ name: "Logout", href: "/logout", dataTest: "link--logout" });
  } else {
    leftMenu.push();
    rightMenu.push(
      { name: "Register", href: "/register", dataTest: "link--register" },
      { name: "Login", href: "/login", dataTest: "link--login" },
    );
  }
</script>

<header class="container center padded">
  <nav class="nav">
    <ul class="left">
      {#each leftMenu as l}
        <li>
          <a href={l.href} data-test={l.dataTest}>{l.name}</a>
        </li>
      {/each}
    </ul>
    <ul class="right">
      {#each rightMenu as r}
        <li>
          <a href={r.href} data-test={r.dataTest}>{r.name}</a>
        </li>
      {/each}
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