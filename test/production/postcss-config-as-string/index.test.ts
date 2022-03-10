import { createNext } from 'e2e-utils'
import { renderViaHTTP } from 'next-test-utils'
import { NextInstance } from 'test/lib/next-modes/base'

describe('PostCSS config as string', () => {
  let next: NextInstance

  beforeAll(async () => {
    next = await createNext({
      files: {
        'pages/index.js': `
          export default function Page() {
            return <p>hello world</p>
          }
        `,
        'global.css': `
          @import "tailwindcss/base";
          @import "tailwindcss/components";
          @import "tailwindcss/utilities";
        `,
        'pages/_app.js': `
          import "../global.css"
          
          export default function MyApp({ Component, pageProps }) {
            return <Component {...pageProps} />
          }
        `,
        'postcss.config.js': `
          module.exports = {
            plugins: {
              'tailwindcss/nesting': 'postcss-nesting',
              tailwindcss: {},
            },
          }
        `,
        'tailwind.config.js': `
          module.exports = {
            content: ['./pages/**/*'],
          }
        `,
      },
      dependencies: {
        'postcss-nesting': '10.1.3',
        tailwindcss: '3.0.23',
      },
    })
  })
  afterAll(() => next.destroy())

  it('should work', async () => {
    console.log('output', next.cliOutput)

    const html = await renderViaHTTP(next.url, '/')
    expect(html).toContain('hello world')
  })
})