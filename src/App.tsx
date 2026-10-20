import { useState } from 'react'
import './App.css'

type TestStatus = 'Not Run' | 'Passed' | 'Failed' | 'Blocked'

type TestCase = {
  id: string
  title: string
  priority: 'High' | 'Medium' | 'Low'
  status: TestStatus
}

const initialTests: TestCase[] = [
  {
    id: 'TC-001',
    title: 'Block approval until required checks pass',
    priority: 'High',
    status: 'Not Run',
  },
  {
    id: 'TC-002',
    title: 'Send suspended licenses to manual review',
    priority: 'High',
    status: 'Not Run',
  },
  {
    id: 'TC-003',
    title: 'Display an error when verification is unavailable',
    priority: 'Medium',
    status: 'Not Run',
  },
]

const tabs = ['Dashboard', 'Test Cases', 'Test Runs', 'Defects'] as const
type Tab = (typeof tabs)[number]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard')
  const [tests, setTests] = useState<TestCase[]>(initialTests)

  const passed = tests.filter((test) => test.status === 'Passed').length
  const failed = tests.filter((test) => test.status === 'Failed').length
  const executed = tests.filter((test) => test.status !== 'Not Run').length

  function updateStatus(id: string, status: TestStatus) {
    setTests((current) =>
      current.map((test) =>
        test.id === id ? { ...test, status } : test,
      ),
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">QUALITY ASSURANCE WORKSPACE</p>
          <h1>QA Test Dashboard</h1>
          <p>Plan tests. Track results. Investigate defects.</p>
        </div>

        <span className="project-badge">
          Provider Verification System
        </span>
      </header>

      <nav className="tabs" aria-label="Workspace navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'tab active' : 'tab'}
            aria-current={activeTab === tab ? 'page' : undefined}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'Dashboard' && (
          <>
            <section className="stats" aria-label="Testing summary">
              <article className="stat-card">
                <p>Total Test Cases</p>
                <h2>{tests.length}</h2>
              </article>

              <article className="stat-card">
                <p>Tests Executed</p>
                <h2>{executed}</h2>
              </article>

              <article className="stat-card">
                <p>Passed</p>
                <h2>{passed}</h2>
              </article>

              <article className="stat-card">
                <p>Failed</p>
                <h2>{failed}</h2>
              </article>
            </section>

            <section className="panel">
              <h2>Project Overview</h2>
              <p>
                Test the provider verification workflow, including
                approval requirements, license checks, manual review,
                and service failures.
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={() => setActiveTab('Test Cases')}
              >
                View Test Cases
              </button>
            </section>
          </>
        )}

        {(activeTab === 'Test Cases' || activeTab === 'Test Runs') && (
          <section className="panel">
            <h2>{activeTab}</h2>
            <p>
              {activeTab === 'Test Cases'
                ? 'Sample test cases for the provider verification workflow.'
                : 'Record manual test results. Summary counts update automatically.'}
            </p>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Test Case</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td>{test.id}</td>
                      <td>{test.title}</td>
                      <td>{test.priority}</td>
                      <td>
                        {activeTab === 'Test Runs' ? (
                          <select
                            aria-label={`Result for ${test.id}`}
                            value={test.status}
                            onChange={(event) =>
                              updateStatus(
                                test.id,
                                event.target.value as TestStatus,
                              )
                            }
                          >
                            <option>Not Run</option>
                            <option>Passed</option>
                            <option>Failed</option>
                            <option>Blocked</option>
                          </select>
                        ) : (
                          test.status
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Defects' && (
          <section className="panel">
            <h2>Defect Tracking</h2>
            <p>
              Next, we’ll add defect reports with reproduction steps,
              expected and actual results, severity, and status.
            </p>
          </section>
        )}
      </main>

      <footer>
        Demo workspace · Results currently reset when the page reloads.
      </footer>
    </div>
  )
}

export default App