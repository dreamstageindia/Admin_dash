import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { epkService } from '../services/epkService';
import { 
    FaUpload, 
    FaDownload, 
    FaTimes, 
    FaCheck, 
    FaExclamationTriangle,
    FaFileExcel,
    FaFileCsv,
    FaCloudUploadAlt,
    FaSpinner
} from 'react-icons/fa';

const BulkUploadModal = ({ open, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Results
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [uploadResults, setUploadResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError('');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    setError('File is empty or has no data.');
                    return;
                }

                // Validate required fields
                const requiredFields = ['artistName', 'artistType'];
                const invalidRows = [];
                
                const validatedData = jsonData.map((row, index) => {
                    const errors = [];
                    requiredFields.forEach(field => {
                        if (!row[field]) {
                            errors.push(`${field} is required`);
                        }
                    });

                    if (errors.length > 0) {
                        invalidRows.push({ row: index + 2, errors }); // +2 for header + 1-index
                    }

                    return {
                        ...row,
                        _rowNumber: index + 2,
                        _errors: errors
                    };
                });

                if (invalidRows.length > 0) {
                    setError(`Validation errors in ${invalidRows.length} rows. Please fix before uploading.`);
                    setPreviewData(validatedData);
                    return;
                }

                setPreviewData(validatedData);
                setStep(2);
            } catch (err) {
                setError('Error reading file. Please make sure it\'s a valid Excel file.');
                console.error('File reading error:', err);
            }
        };
        
        reader.onerror = () => {
            setError('Error reading file. Please try again.');
        };
        
        reader.readAsArrayBuffer(selectedFile);
    };

    const downloadTemplate = async () => {
        try {
            const response = await epkService.getTemplate();
            const template = response.data;
            
            const workbook = XLSX.utils.book_new();
            
            // Create headers row
            const headers = template.headers;
            
            // Create sample data row
            const sampleRow = headers.map(header => {
                const key = header;
                const value = template.sampleData[key] || '';
                return value;
            });
            
            const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
            
            // Set column widths for better readability
            const wscols = headers.map(() => ({ wch: 25 }));
            worksheet['!cols'] = wscols;
            
            XLSX.utils.book_append_sheet(workbook, worksheet, 'EPK Template');
            
            // Add instructions sheet
            const instructions = [
                ['EPK BULK UPLOAD TEMPLATE - INSTRUCTIONS'],
                [''],
                ['REQUIRED FIELDS:'],
                ['• artistName: Name of the artist/band (required)'],
                ['• artistType: Type of artist (Music Band, Solo Artist, DJ, etc.) (required)'],
                [''],
                ['SECTION DATA FIELDS:'],
                ['• Fields starting with "hero_" are for Hero section'],
                ['• Fields starting with "gig_experience_" are for Gig Experience section (2 cards)'],
                ['• Fields starting with "my_works_" are for My Works section (3 samples)'],
                ['• Fields starting with "media_assets_" are for Media Assets section (3 assets)'],
                ['• Fields starting with "artist_crew_" are for Artist Crew section (2 members)'],
                ['• Fields starting with "artist_band_" are for Artist Band section (2 members)'],
                ['• Fields starting with "affiliations_" are for Affiliations section (3 items)'],
                [''],
                ['BOOLEAN FIELDS:'],
                ['• Use "true" or "false" (case insensitive)'],
                ['• Example: isPublished, seoEnabled, analyticsEnabled'],
                [''],
                ['IMAGE FIELDS:'],
                ['• Leave empty to use default placeholder images'],
                ['• Provide valid image URLs if available'],
                [''],
                ['TAGS FIELD:'],
                ['• Separate tags with commas'],
                ['• Example: "Rock,Indie,Folk,Alternative"'],
                [''],
                ['NOTE:'],
                ['• All fields are optional except artistName and artistType'],
                ['• Empty cells will use default values or sample data'],
                ['• Remove sample data before uploading your own data']
            ];
            
            const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
            XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');
            
            const fileName = `epk_bulk_upload_template_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Failed to download template. Please try again.');
        }
    };

    const handleUpload = async () => {
        if (!previewData || previewData.length === 0) {
            setError('No data to upload.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Filter out rows with errors
            const validData = previewData.filter(row => !row._errors || row._errors.length === 0);
            
            if (validData.length === 0) {
                setError('No valid data to upload. Please fix validation errors.');
                setLoading(false);
                return;
            }

            // Upload to server
            const response = await epkService.bulkImportEPKs(validData);
            
            setUploadResults(response.data);
            setStep(3);
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(error.response?.data?.message || 'Failed to upload EPKs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreviewData([]);
        setUploadResults(null);
        setError('');
        setStep(1);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            Bulk Upload EPKs
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <FaTimes className="text-gray-500" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            1
                        </div>
                        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            2
                        </div>
                        <div className={`flex-1 h-1 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            3
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <FaCloudUploadAlt className="text-purple-600 text-2xl" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Excel File</h3>
                                <p className="text-gray-600 mb-6">
                                    Upload an Excel file containing EPK data. Make sure it follows the template format.
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".xlsx,.xls,.csv"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer"
                                >
                                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <FaUpload className="text-gray-400 text-xl" />
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Excel files only (.xlsx, .xls, .csv)
                                    </div>
                                </label>
                            </div>

                            {file && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FaFileExcel className="text-green-600 text-xl" />
                                            <div>
                                                <div className="font-medium text-gray-800">{file.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <FaDownload className="text-blue-600 mt-1" />
                                        <div>
                                            <h4 className="font-medium text-blue-800 mb-1">Download Template</h4>
                                            <p className="text-sm text-blue-700 mb-3">
                                                Use our comprehensive template with all section fields.
                                            </p>
                                            <button
                                                onClick={downloadTemplate}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                <FaDownload /> Download Template
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <FaExclamationTriangle className="text-yellow-600 mt-1" />
                                        <div>
                                            <h4 className="font-medium text-yellow-800 mb-1">Template Includes</h4>
                                            <ul className="text-sm text-yellow-700 space-y-1">
                                                <li>• All EPK sections with sample data</li>
                                                <li>• 2 Gig Experience cards</li>
                                                <li>• 3 My Works samples</li>
                                                <li>• 3 Media Assets</li>
                                                <li>• 2 Artist Crew members</li>
                                                <li>• 2 Artist Band members</li>
                                                <li>• 3 Affiliations</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-800 mb-2">How to Use:</h4>
                                <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-4">
                                    <li>Download the template using the button above</li>
                                    <li>Fill in your data following the sample format</li>
                                    <li>Only fill fields you need - empty fields will use defaults</li>
                                    <li>For section data (like gig experiences), fill as many as you need (1-2)</li>
                                    <li>Upload your completed Excel file</li>
                                    <li>Review the data preview before final upload</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Data</h3>
                                <p className="text-gray-600 mb-6">
                                    Review the data before uploading. {previewData.length} rows found.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <FaExclamationTriangle className="text-red-600 mt-1" />
                                        <div>
                                            <h4 className="font-medium text-red-800 mb-1">Validation Errors</h4>
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Row
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Artist Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stage Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Gig Experiences
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Works
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {previewData.slice(0, 5).map((row, index) => (
                                            <tr key={index} className={row._errors?.length > 0 ? 'bg-red-50' : 'hover:bg-gray-50'}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                    {row._rowNumber}
                                                    {row._errors?.length > 0 && (
                                                        <div className="text-red-600 text-xs mt-1">
                                                            {row._errors[0]}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {row.artistName || <span className="text-red-500">Missing</span>}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {row.artistType || <span className="text-red-500">Missing</span>}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {row.stageName || row.artistName || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {row.gig_experience_1_eventName ? '✓ 1' : '0'} /
                                                    {row.gig_experience_2_eventName ? ' ✓ 2' : ' 0'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {[
                                                        row.my_works_1_sampleName,
                                                        row.my_works_2_sampleName,
                                                        row.my_works_3_sampleName
                                                    ].filter(Boolean).length} works
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {row._errors?.length > 0 ? (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                            Error
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                            OK
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {previewData.length > 5 && (
                                <div className="text-center text-sm text-gray-500">
                                    Showing first 5 of {previewData.length} rows
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-medium text-gray-700">Total Rows</div>
                                    <div className="text-2xl font-bold text-gray-900">{previewData.length}</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="font-medium text-green-700">Valid Rows</div>
                                    <div className="text-2xl font-bold text-green-900">
                                        {previewData.filter(row => !row._errors || row._errors.length === 0).length}
                                    </div>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <div className="font-medium text-red-700">Rows with Errors</div>
                                    <div className="text-2xl font-bold text-red-900">
                                        {previewData.filter(row => row._errors && row._errors.length > 0).length}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    {previewData.filter(row => row._errors && row._errors.length > 0).length > 0 && (
                                        <div className="text-red-600 text-sm">
                                            Fix errors before uploading
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={loading || previewData.filter(row => !row._errors || row._errors.length === 0).length === 0}
                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                            loading || previewData.filter(row => !row._errors || row._errors.length === 0).length === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload /> Upload {previewData.filter(row => !row._errors || row._errors.length === 0).length} EPKs
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && uploadResults && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    uploadResults.success > 0 ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    {uploadResults.success > 0 ? (
                                        <FaCheck className="text-green-600 text-2xl" />
                                    ) : (
                                        <FaExclamationTriangle className="text-red-600 text-2xl" />
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Complete</h3>
                                <p className="text-gray-600 mb-6">
                                    {uploadResults.message}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-1">
                                        {uploadResults.success}
                                    </div>
                                    <div className="text-sm font-medium text-green-800">Successful</div>
                                    <div className="text-xs text-green-600 mt-1">EPKs created</div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-red-600 mb-1">
                                        {uploadResults.failed}
                                    </div>
                                    <div className="text-sm font-medium text-red-800">Failed</div>
                                    <div className="text-xs text-red-600 mt-1">Could not create</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {uploadResults.success + uploadResults.failed}
                                    </div>
                                    <div className="text-sm font-medium text-blue-800">Total Processed</div>
                                    <div className="text-xs text-blue-600 mt-1">Rows attempted</div>
                                </div>
                            </div>

                            {uploadResults.errors && uploadResults.errors.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2">
                                        Errors ({uploadResults.errors.length})
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {uploadResults.errors.slice(0, 5).map((error, index) => (
                                            <div key={index} className="text-sm p-2 bg-yellow-100 rounded">
                                                <span className="font-medium">{error.artistName}:</span>
                                                <span className="text-red-600 ml-2">{error.error}</span>
                                            </div>
                                        ))}
                                        {uploadResults.errors.length > 5 && (
                                            <div className="text-center text-sm text-yellow-700">
                                                ... and {uploadResults.errors.length - 5} more errors
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-medium text-green-800 mb-2">What was created:</h4>
                                <ul className="text-sm text-green-700 space-y-1">
                                    <li>• Complete EPK with all 9 sections</li>
                                    <li>• Hero section with image and background</li>
                                    <li>• Profile stats with bio and social links</li>
                                    <li>• Gig Experience section (2 cards with data)</li>
                                    <li>• My Works section (3 sample works like Monsoon Drifters)</li>
                                    <li>• Media Assets section (3 assets)</li>
                                    <li>• Artist Crew section (2 members)</li>
                                    <li>• Artist Band section (2 members)</li>
                                    <li>• Affiliations section (3 items)</li>
                                    <li>• Endorsements section (empty)</li>
                                </ul>
                            </div>

                            <div className="flex justify-center gap-3 pt-4">
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Upload Another File
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkUploadModal;