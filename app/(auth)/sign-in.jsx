import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from "../../assets/styles/auth.styles"
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { Image } from 'expo-image'


export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Handle the submission of the sign-in form
    // 处理签到表格的提交
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        // 使用提供的电子邮件和密码启动登录过程
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // 如果登录过程完成，将创建的会话设置为活动状态
            // and redirect the user
            // 重定向用户
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // 如果状态不完整，请检查原因。用户可能需要
                // complete further steps.
                // 完成进一步的步骤。
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            if (err.errors?.[0]?.code === "form_password_incorrect") {
                setError('密码错误,请再试一次')
            } else {
                setError('出现错误了,请再试一次')
            }
            console.log(err);
        }
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={styles.container}>
                <Image source={require('../../assets/images/revenue-i4.png')} style={styles.illustration}></Image>
                <Text style={styles.title}>欢迎回来</Text>

                {
                    error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={20} color={COLORS.expense}></Ionicons>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={() => setError('')}>
                                <Ionicons name="close" size={20} color={COLORS.textLight}></Ionicons>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholderTextColor="#9A8478"
                    placeholder="输入电邮地址"
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="输入密码"
                    placeholderTextColor="#9A8478"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                    <Text style={styles.buttonText}>继续</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>还没有账号吗?</Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>注册</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}