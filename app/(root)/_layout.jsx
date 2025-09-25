import { useUser } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"
import { Stack } from "expo-router/stack"

export default function Layout() {
    const { isSignedIn } = useUser()

    // 如果用户未登录，则重定向到登录页面
    if (!isSignedIn) return <Redirect href={'/sign-in'} />

    return <Stack screenOptions={{ headerShown: false }} />
}