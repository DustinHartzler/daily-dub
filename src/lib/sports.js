// TODO: rename shot_sessions -> practice_sessions when baseball/soccer get real forms.
// For now the table name is shot_sessions and basketball is the only real form.

import { SHOT_TYPES } from './constants'

export const SPORTS = {
  basketball: {
    id: 'basketball',
    label: 'Basketball',
    icon: 'basketball',
    shotTypes: SHOT_TYPES,
  },
  baseball: {
    id: 'baseball',
    label: 'Baseball',
    icon: 'baseball',
    shotTypes: [], // forms TBD: at-bats / hits / pitches / minutes
  },
  soccer: {
    id: 'soccer',
    label: 'Soccer',
    icon: 'soccer',
    shotTypes: [], // forms TBD: shots on goal / saves / minutes
  },
}

export const SPORT_ORDER = ['basketball', 'baseball', 'soccer']

// Per-kid sport list. Kenley plays basketball only; Kellen is multi-sport.
export const SPORTS_BY_KID = {
  kenley: ['basketball'],
  kellen: SPORT_ORDER,
}

export const getSportsForKid = (kidId) => SPORTS_BY_KID[kidId] ?? ['basketball']
