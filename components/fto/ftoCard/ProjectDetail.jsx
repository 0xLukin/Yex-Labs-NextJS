import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useContractRead, useContractReads } from "wagmi"
import { FTO_FACTORY_ADDRESS } from "@/contracts/addresses"
import {
  MUBAI_FTO_FACTORY_ABI,
  MUBAI_FTO_PAIR_ABI,
  ERC20_ABI
} from "@/contracts/abis"
import { formatEther } from "viem"

export default function ProjectDetail({ index }) {
  const [price, setPrice] = useState(0)
  const [state, setState] = useState("")
  const router = useRouter()

  const { data: pairAddress } = useContractRead({
    address: FTO_FACTORY_ADDRESS,
    abi: MUBAI_FTO_FACTORY_ABI,
    functionName: "allPairs",
    args: [index]
  })

  const { data: tokenAAddress } = useContractRead({
    address: pairAddress,
    abi: MUBAI_FTO_PAIR_ABI,
    functionName: "tokenA"
  })

  const { data: tokenBAddress } = useContractRead({
    address: pairAddress,
    abi: MUBAI_FTO_PAIR_ABI,
    functionName: "tokenB"
  })

  console.log(tokenBAddress, "tokenBAddress")

  const { data: ftoState } = useContractRead({
    address: pairAddress,
    abi: MUBAI_FTO_PAIR_ABI,
    functionName: "ftoState"
  })

  const { data: name } = useContractRead({
    address: tokenBAddress,
    abi: ERC20_ABI,
    functionName: "name",
    onSuccess: (data) => {
      console.log(data, "+++++++++++")
    },
    onError: (error) => {
      console.log(error, "+++++++++++")
    }
  })

  const { data: tokenA } = useContractRead({
    address: pairAddress,
    abi: MUBAI_FTO_PAIR_ABI,
    functionName: "deposited_TokenA"
  })

  const { data: tokenB } = useContractRead({
    address: pairAddress,
    abi: MUBAI_FTO_PAIR_ABI,
    functionName: "deposited_TokenB"
  })

  console.log(index, "index index index")
  console.log(tokenA, tokenB, index, "index token A and B")

  useEffect(() => {
    if (tokenA && tokenB) {
      const FloatTokenA = formatEther(tokenA)
      const FloatTokenB = formatEther(tokenB)
      console.log(
        FloatTokenA,
        FloatTokenB,
        index,
        "index+++++++++++++++++++++++++++"
      )

      setPrice(FloatTokenB / FloatTokenA)
    }
  }, [tokenA, tokenB])

  console.log(price, "price")

  const { data: end_time } = useContractRead({
    address: pairAddress,
    abi: MUBAI_FTO_PAIR_ABI,
    functionName: "end_time"
  })

  const getTimeDiff = () => {
    return Number(end_time) - Math.floor(Date.now() / 1000)
  }

  const calculateTimeLeft = () => {
    const timeDiff = getTimeDiff()

    const hours = Math.floor(timeDiff / 3600)
    const minutes = Math.floor((timeDiff % 3600) / 60)
    const seconds = timeDiff % 60

    return timeDiff>0 ? `${hours}h ${minutes}m ${seconds}s`: "0"
  }

  useEffect(() => {
    if (ftoState == 0) {
      setState("Success")
    } else if (ftoState == 1) {
      setState("Failed")
    } else if(getTimeDiff() <=0) {
      setState("campaign completed")
    } else{
      setState("processing")
    }
  }, [ftoState])
   
  const timeLeft = end_time ? calculateTimeLeft() : "Loading..."

  const handleHackathonClick = (pairAddress) => {
    router.push("/ilo" + "/" + pairAddress)
  }

  return (
    <div
      className={`w-1/3 border h-full rounded ${
        "status" === "ongoing" ? "" : ""
      } hover:bg-gray-200 hover:cursor-pointer hover:border-4 hover:border-indigo-100 hover:shadow-lg 
                    transition-all ease-in-out duration-300`}
    >
      <Card
        className="min-h-[265px]"
        onClick={() => handleHackathonClick(pairAddress)}
        key={index}
      >
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>price: {price.toString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Timeline: {timeLeft}</div>
          <div>
            Total Raised: {tokenA ? formatEther(tokenA).toString() : "0"}
          </div>
        </CardContent>
        <CardFooter>
          <div>{state.toUpperCase() + status.slice(1)}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
