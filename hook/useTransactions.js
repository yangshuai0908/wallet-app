import { useCallback, useState } from "react"
import { Alert } from "react-native"

const API_URL = "https://wallet-api-6ofi.onrender.com/api/transactions"
export const useTransactions = (useId) => {
    const [transactions, setTransactions] = useState([])

    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0
    })
    const [isloading, setIsLoading] = useState(true)

    // “useCallback” 是出于性能考虑而使用的，它会将函数进行缓存。
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/${useId}`)
            const data = await response.json()
            setTransactions(data)
        } catch (error) {
            console.error("获取交易信息时出错:", error);
        }
    }, [useId])

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/summary/${useId}`)
            const data = await response.json()
            setSummary(data)
        } catch (error) {
            console.error("获取交易信息时出错:", error);
        }
    }, [useId])

    const loadData = useCallback(async () => {
        if (!useId) return
        setIsLoading(true)
        try {
            await Promise.all([fetchTransactions(), fetchSummary()])
        } catch (error) {
            console.error("加载数据时出错:", error);
        } finally {
            setIsLoading(false)
        }
    }, [fetchSummary, fetchTransactions, useId])


    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('删除交易失败');
            // 删除成功，重新加载数据
            loadData()
            Alert.alert('Success', "交易删除成功")
        } catch (error) {
            console.error("删除交易时出错:", error);
            Alert.alert('Error', error.message)
        }
    }
    return { deleteTransaction, summary, transactions, isloading, loadData }
}