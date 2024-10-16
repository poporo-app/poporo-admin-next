import { GeoPoint } from 'firebase/firestore'
import { Timestamp } from 'firebase-admin/firestore'

export {}

declare global {
  interface Login {
    email: string
    password: string
  }

  interface SalonUser {
    id: string
    name: string
    cityName: string
    categories: number[]
    invitationCode?: string
    imageUrl?: string
    twitText?: string
    postalCode?: string
    prefCode?: string
    address?: string
    access?: string
    phone?: string
    representativeName?: string
    salonDiscription?: string
    staffNumber?: number
    point?: number
    salonRegisterFlg?: boolean
    createdAt?: Timestamp
    updatedAt?: Timestamp
    likes?: string[] | null
    location?: GeoPoint
    refUrl?: string
    email?: string
    fcmToken?: string
    isApproved?: boolean
  }

  interface InviteUsers {
    id: string
    uid: string
    invitationCode?: string
    isInvite?: boolean
    targetUser?: SalonUser
    inviteUser?: SalonUser
    createdAt?: Timestamp
    updatedAt?: Timestamp
  }

  interface PointHistory {
    id: string
    point: number
    type: string
    createdAt?: Timestamp
  }

  interface UserSearchParams {
    query?: string
    category?: string
    isApply?: string
    sort?: string
    lastVisible?: string
    limit?: number
  }
}
