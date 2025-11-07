import React, { useState } from 'react';
import { PlayIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { crudTester } from '../../__tests__/utils/testCrudOperations';

interface CrudTestPanelProps {
    isVisible: boolean;
    className?: string;
}

export const CrudTestPanel: React.FC<CrudTestPanelProps> = ({ isVisible, className = '' }) => {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const runFullTest = async () => {
        setIsRunning(true);
        setTestResults([]);

        try {
            addResult('🚀 Starting CRUD test...');

            // Get first parish for testing
            const { parishApi } = await import('../../services/api');
            const parishResult = await parishApi.getAll({ search: '' });

            if (parishResult.parishes.length === 0) {
                addResult('❌ No parishes found for testing');
                return;
            }

            const parishId = parishResult.parishes[0].id;
            addResult(`📍 Using parish: ${parishResult.parishes[0].name}`);

            // Run CRUD operations with custom logging
            const originalConsoleLog = console.log;
            const originalConsoleError = console.error;

            console.log = (message: string, ...args: any[]) => {
                addResult(message);
                originalConsoleLog(message, ...args);
            };

            console.error = (message: string, ...args: any[]) => {
                addResult(message);
                originalConsoleError(message, ...args);
            };

            await crudTester.runFullCrudTest(parishId);

            // Restore console methods
            console.log = originalConsoleLog;
            console.error = originalConsoleError;

            addResult('🏁 CRUD test completed!');
        } catch (error) {
            addResult(`❌ Test failed: ${error}`);
        } finally {
            setIsRunning(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`bg-slate-50 border border-slate-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">CRUD Operations Test</h3>
                <button
                    onClick={runFullTest}
                    disabled={isRunning}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isRunning ? (
                        <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Running...
                        </>
                    ) : (
                        <>
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Run Test
                        </>
                    )}
                </button>
            </div>

            <div className="text-sm text-slate-600 mb-3">
                This will test CREATE, READ, UPDATE, and DELETE operations on a test ministry.
                The test ministry will be automatically deleted after testing.
            </div>

            {testResults.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Test Results:</h4>
                    <div className="space-y-1 font-mono text-xs">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`flex items-start space-x-2 ${result.includes('❌') ? 'text-red-600' :
                                    result.includes('✅') ? 'text-green-600' :
                                        result.includes('🟡') ? 'text-yellow-600' :
                                            'text-slate-600'
                                    }`}
                            >
                                <span className="flex-shrink-0">
                                    {result.includes('❌') ? <XCircleIcon className="h-4 w-4" /> :
                                        result.includes('✅') ? <CheckCircleIcon className="h-4 w-4" /> :
                                            null}
                                </span>
                                <span className="break-all">{result}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-3 text-xs text-slate-500">
                💡 Tip: You can also open browser console and run <code>runQuickCrudTest()</code> for testing.
            </div>
        </div>
    );
};