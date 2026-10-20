import { useEffect, useState } from 'react'
import './App.css'

type TestStatus = 'Not Run' | 'Passed' | 'Failed' | 'Blocked'

type TestCase = {
  id: string
  title: string
  priority: 'High' | 'Medium' | 'Low'
  status: TestStatus
  steps?: string
  expected?: string
}

type Defect = {
  id: string
  testCaseId?: string
  title: string
  steps: string
  expected: string
  actual: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
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
  const [newTitle, setNewTitle] = useState('')
  const [newSteps, setNewSteps] = useState('')
  const [newExpected, setNewExpected] = useState('')
  const [newPriority, setNewPriority] =
    useState<TestCase['priority']>('Medium')
  const [tests, setTests] = useState<TestCase[]>(() => {
    try {
      const saved = localStorage.getItem('qa-dashboard-tests')
      return saved ? JSON.parse(saved) : initialTests
    } catch {
      return initialTests
    }
  })

  const [defects, setDefects] = useState<Defect[]>(() => {
    try {
      const saved = localStorage.getItem('qa-dashboard-defects')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [defectTitle, setDefectTitle] = useState('')
  const [defectSteps, setDefectSteps] = useState('')
  const [defectExpected, setDefectExpected] = useState('')
  const [defectActual, setDefectActual] = useState('')
  const [defectSeverity, setDefectSeverity] =
    useState<Defect['severity']>('Medium')

  useEffect(() => {
    localStorage.setItem('qa-dashboard-defects', JSON.stringify(defects))
  }, [defects])

  useEffect(() => {
    localStorage.setItem('qa-dashboard-defects', JSON.stringify(defects))
  }, [defects])

  useEffect(() => {
    localStorage.setItem('qa-dashboard-tests', JSON.stringify(tests))
  }, [tests])
  const openDefects = defects.filter(
    (defect) => defect.status !== 'Closed',
  ).length
  const passed = tests.filter((test) => test.status === 'Passed').length
  const failed = tests.filter((test) => test.status === 'Failed').length
  const executed = tests.filter((test) => test.status !== 'Not Run').length
  const [defectTestCaseId, setDefectTestCaseId] = useState('')

  function updateDefectStatus(id: string, status: Defect['status']) {
    setDefects((current) =>
      current.map((defect) =>
        defect.id === id ? { ...defect, status } : defect,
      ),
    )
  }

  function addDefect() {
    const title = defectTitle.trim()
    const steps = defectSteps.trim()
    const expected = defectExpected.trim()
    const actual = defectActual.trim()

    if (!title || !steps || !expected || !actual) return

    setDefects((current) => [
      ...current,
      {
        id: `BUG-${crypto.randomUUID()}`,
        title,
        testCaseId: defectTestCaseId || undefined,
        steps,
        expected,
        actual,
        severity: defectSeverity,
        status: 'Open',
      },
    ])

    setDefectTitle('')
    setDefectTestCaseId('')
    setDefectSteps('')
    setDefectExpected('')
    setDefectActual('')
    setDefectSeverity('Medium')
  }

  function addTestCase() {
    const title = newTitle.trim()
    if (!title) return

    setTests((current) => {
      const nextNumber =
        Math.max(
          0,
          ...current.map((test) => Number(test.id.replace('TC-', '')) || 0),
        ) + 1

      return [
        ...current,
        {
          id: `TC-${String(nextNumber).padStart(3, '0')}`,
          title,
          steps: newSteps.trim(),
          expected: newExpected.trim(),
          priority: newPriority,
          status: 'Not Run',
        },
      ]
    })

    setNewTitle('')
    setNewSteps('')
    setNewExpected('')
    setNewPriority('Medium')
  }

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
            <article className="stat-card">
              <p>Open Defects</p>
              <h2>{openDefects}</h2>
            </article>
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
            {activeTab === 'Test Cases' && (
              <form
                className="test-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  addTestCase()
                }}
              >
                <label htmlFor="test-title">Test case title</label>
                <input
                  id="test-title"
                  type="text"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Example: Prevent two reviewers from approving at once"
                  maxLength={200}
                  required
                />
                <label htmlFor="test-steps">Steps to execute</label>
                <textarea
                  id="test-steps"
                  value={newSteps}
                  onChange={(event) => setNewSteps(event.target.value)}
                  placeholder="1. Open a provider record..."
                  rows={4}
                />

                <label htmlFor="test-expected">Expected result</label>
                <textarea
                  id="test-expected"
                  value={newExpected}
                  onChange={(event) => setNewExpected(event.target.value)}
                  placeholder="Describe what should happen."
                  rows={3}
                />
                <label htmlFor="test-priority">Priority</label>
                <select
                  id="test-priority"
                  value={newPriority}
                  onChange={(event) =>
                    setNewPriority(event.target.value as TestCase['priority'])
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!newTitle.trim()}
                >
                  Add Test Case
                </button>
              </form>
            )}

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
                      <td>
                        <strong>{test.title}</strong>

                        {(test.steps || test.expected) && (
                          <details>
                            <summary>View test instructions</summary>

                            <p className="preserve-lines">
                              <strong>Steps:</strong>
                              {'\n'}
                              {test.steps || 'No steps provided.'}
                            </p>

                            <p className="preserve-lines">
                              <strong>Expected result:</strong>
                              {'\n'}
                              {test.expected || 'No expected result provided.'}
                            </p>
                          </details>
                        )}
                      </td>
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
            <p>Document issues so another developer can reproduce them.</p>

            <form
              className="test-form"
              onSubmit={(event) => {
                event.preventDefault()
                addDefect()
              }}
            >
              <label htmlFor="defect-test">Related test case</label>
              <select
                id="defect-test"
                value={defectTestCaseId}
                onChange={(event) => setDefectTestCaseId(event.target.value)}
              >
                <option value="">No linked test case</option>
                {tests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.id} — {test.title}
                  </option>
                ))}
              </select>
              <label htmlFor="defect-title">Defect title</label>
              <input
                id="defect-title"
                value={defectTitle}
                onChange={(event) => setDefectTitle(event.target.value)}
                maxLength={200}
                required
              />

              <label htmlFor="defect-steps">Steps to reproduce</label>
              <textarea
                id="defect-steps"
                value={defectSteps}
                onChange={(event) => setDefectSteps(event.target.value)}
                placeholder="1. Open a provider record..."
                rows={4}
                required
              />

              <label htmlFor="defect-expected">Expected result</label>
              <textarea
                id="defect-expected"
                value={defectExpected}
                onChange={(event) => setDefectExpected(event.target.value)}
                rows={3}
                required
              />

              <label htmlFor="defect-actual">Actual result</label>
              <textarea
                id="defect-actual"
                value={defectActual}
                onChange={(event) => setDefectActual(event.target.value)}
                rows={3}
                required
              />

              <label htmlFor="defect-severity">Severity</label>
              <select
                id="defect-severity"
                value={defectSeverity}
                onChange={(event) =>
                  setDefectSeverity(event.target.value as Defect['severity'])
                }
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button
                type="submit"
                className="primary-button"
                disabled={
                  !defectTitle.trim() ||
                  !defectSteps.trim() ||
                  !defectExpected.trim() ||
                  !defectActual.trim()
                }
              >
                Report Defect
              </button>
            </form>

            <h3>Reported Defects ({defects.length})</h3>

            {defects.length === 0 ? (
              <p>No defects reported yet.</p>
            ) : (
              <div className="defect-list">
                {defects.map((defect) => (
                  <article className="defect-card" key={defect.id}>
                    <h3>{defect.title}</h3>
                    <p>
                      <strong>Related test:</strong>{' '}
                      {defect.testCaseId
                        ? `${defect.testCaseId} — ${tests.find((test) => test.id === defect.testCaseId)?.title ??
                        'Test case unavailable'
                        }`
                        : 'No linked test case'}
                    </p>
                    <p><strong>Severity:</strong> {defect.severity}</p>
                    <label htmlFor={`status-${defect.id}`}>
                      <strong>Status: </strong>
                    </label>

                    <select
                      id={`status-${defect.id}`}
                      value={defect.status ?? 'Open'}
                      onChange={(event) =>
                        updateDefectStatus(
                          defect.id,
                          event.target.value as Defect['status'],
                        )
                      }
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>

                    <h4>Steps to reproduce</h4>
                    <p className="preserve-lines">{defect.steps}</p>

                    <h4>Expected result</h4>
                    <p className="preserve-lines">{defect.expected}</p>

                    <h4>Actual result</h4>
                    <p className="preserve-lines">{defect.actual}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        Demo workspace · Results are saved in this browser.
      </footer>
    </div>
  )
}

export default App