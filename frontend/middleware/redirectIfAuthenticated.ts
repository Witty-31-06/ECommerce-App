export default defineNuxtRouteMiddleware((to, from) => {
    const { $auth } = useNuxtApp();
    
    if ($auth.currentUser && (to.path === "/auth/login" || to.path === "/auth/register")) {
      return navigateTo("/");
    }
  });
  