import React from "react"
import { useForm } from "react-hook-form"
import { useContractWrite } from "wagmi"

export default function TokenDetails() {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "address",
    abi: "ABI",
    functionName: "createFTO"
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    const {
      tokenAddress,
      tokenName,
      tokenSymbol,
      tokenAmount,
      poolHandler,
      rasing_cycle
    } = data
    write({
      args: [
        tokenAddress,
        tokenName,
        tokenSymbol,
        tokenAmount,
        poolHandler,
        rasing_cycle
      ]
    })
  }

  return (
    <dialog id="tokenDetails_modal" className="modal">
      <form
        method="dialog"
        className="modal-box"
        onSubmit={handleSubmit(onSubmit)}
      >
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
        <h3 className="font-bold text-lg mb-8">Token Details</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium">Token Address</label>
          <input
            type="text"
            {...register("tokenAddress", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.tokenAddress && (
            <span className="text-red-500">Token Address is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Token Name</label>
          <input
            type="text"
            {...register("tokenName", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.tokenName && (
            <span className="text-red-500">Token Name is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Token Symbol</label>
          <input
            type="text"
            {...register("tokenSymbol", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.tokenSymbol && (
            <span className="text-red-500">Token Symbol is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Token Amount</label>
          <input
            type="text"
            {...register("tokenAmount", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.tokenAmount && (
            <span className="text-red-500">Token Amount is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Pool Handler</label>
          <input
            type="number"
            {...register("poolHandler", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.poolHandler && (
            <span className="text-red-500">Pool Handler is required</span>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium">Rasing Cycle</label>
          <input
            type="number"
            {...register("rasing_cycle", { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {errors.rasing_cycle && (
            <span className="text-red-500">Rasing Cycle is required</span>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button type="submit" className="btn">
            Launch My Token
          </button>
        </div>
      </form>
    </dialog>
  )
}