import { debug } from '@actions/core'
import axios, { AxiosError } from 'axios'
import { ErrorResponse } from './types'

const isAxiosError = <ResponseType>(error: unknown): error is AxiosError<ResponseType> => {
  return axios.isAxiosError(error)
}

export const toMoreDescriptiveError = (error: unknown): Error | unknown => {
  if (
    isAxiosError<ErrorResponse>(error) &&
    Number(error.response?.status) >= 400 &&
    Number(error.response?.status) < 500 &&
    Array.isArray(error.response?.data.errorMessages)
  ) {
    return new Error(error.response?.data.errorMessages[0])
  } else {
    debug(`${error}`)
    return error
  }
}
