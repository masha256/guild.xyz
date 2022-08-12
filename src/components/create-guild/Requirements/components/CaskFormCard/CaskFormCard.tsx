import { FormControl, FormLabel, InputGroup } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Chains } from "connectors"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainPicker from "../ChainPicker"

const CHAINS_ENDPOINTS = {
  137: "polygon",
  43114: "avalanche",
}

const supportedChains = Object.keys(CHAINS_ENDPOINTS).map(
  (chainId) => Chains[chainId]
)

type Props = {
  index: number
  field: Requirement
}

const customFilterOption = (candidate, input) =>
  candidate.label?.toLowerCase().includes(input?.toLowerCase()) ||
  candidate.value?.toLowerCase() === input?.toLowerCase()

const CaskFormCard = ({ index, field }: Props): JSX.Element => {
  const {
    control,
    setValue,
    formState: { errors, touchedFields },
  } = useFormContext<GuildFormType>()

  const chain = useWatch({ name: `requirements.${index}.chain` })
  const address = useWatch({ name: `requirements.${index}.provider` })
  const planId = useWatch({ name: `requirements.${index}.data.id` })

  // Reset form on chain change
  const resetForm = () => {
    if (!touchedFields?.requirements?.[index]?.address) return
    setValue(`requirements.${index}.address`, null)
  }

  return (
    <>
      <ChainPicker
        controlName={`requirements.${index}.chain` as const}
        defaultChain={field.chain}
        supportedChains={supportedChains}
        onChange={resetForm}
      />

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.address}>
        <FormLabel>Cask Provider Address:</FormLabel>

        <InputGroup>
          <Controller
            name={`requirements.${index}.address` as const}
            control={control}
            defaultValue={field.address}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                options={[]}
                placeholder="Paste provider address"
                value={null}
                onChange={(selectedOption: SelectOption) =>
                  onChange(selectedOption?.value)
                }
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>
        <FormErrorMessage>
          {errors?.requirements?.[index]?.address?.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.requirements?.[index]?.data.id}>
        <FormLabel>Cask Plan ID:</FormLabel>

        <InputGroup>
          <Controller
            name={`requirements.${index}.data.id` as const}
            control={control}
            defaultValue={field.data.id}
            rules={{
              required: "This field is required.",
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <StyledSelect
                ref={ref}
                isClearable
                options={[]}
                placeholder="Paste plan ID"
                value={null}
                onChange={(selectedOption: SelectOption) =>
                  onChange(selectedOption?.value)
                }
                onBlur={onBlur}
                filterOption={customFilterOption}
              />
            )}
          />
        </InputGroup>

        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export { supportedChains as unlockSupportedChains }
export default CaskFormCard
