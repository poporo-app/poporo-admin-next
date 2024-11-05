import type { NextApiRequest, NextApiResponse } from 'next'

// 認証をバイパスするヘルスチェック用エンドポイント
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'ok' })
}
