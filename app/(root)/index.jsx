import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View, FlatList, Alert } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { BalanceCard } from '@/components/BalanceCard'
import { TransactionItem } from '@/components/TransactionItem'
import { useTransactions } from '@/hook/useTransactions'
import { useEffect } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const { transactions, summary, isloading, loadData, deleteTransaction } = useTransactions(user?.id)


  console.log("summaty",summary);

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = (id) => {
    Alert.alert('删除', '确定要删除吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', style: "destructive", onPress: () => deleteTransaction(id) },
    ])
  }

  if (isloading) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 头部 */}
        <View style={styles.header}>
          {/* 左边 */}
          <View style={styles.headerLeft}>
            <Image source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              contentFit='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0].emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* 右边 */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>近期交易记录</Text>
        </View>
      </View>

      <FlatList style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
      />
    </View>
  )
}