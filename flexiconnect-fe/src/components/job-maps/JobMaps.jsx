import { useState, useEffect } from 'react';
import { cn } from "@/utils/cn";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Moon, Sun, MapPin, Navigation, ExternalLink, Maximize2, Minimize2, Layers, Compass } from 'lucide-react';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const JobMap = ({ job }) => {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState('standard');

  useEffect(() => {
    setPosition(null);
    setIsLoading(true);
    setError('');

    const fetchCoordinates = async () => {
      if (job.latitude && job.longitude) {
        setPosition([job.latitude, job.longitude]);
        setIsLoading(false);
        return;
      }

      if (job.location) {
        try {
          const encodedLocation = encodeURIComponent(job.location);
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`, {
            headers: {
              'User-Agent': 'FlexiJobWeb/1.0 (your-email@example.com)'
            }
          });

          if (!response.ok) {
            throw new Error('Yêu cầu Geocoding không thành công.');
          }

          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setPosition([parseFloat(lat), parseFloat(lon)]);
          } else {
            throw new Error(`Không tìm thấy tọa độ cho địa chỉ: "${job.location}"`);
          }
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('Không có thông tin vị trí để hiển thị bản đồ.');
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [job]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getTileLayerUrl = () => {
    const tileOptions = {
      standard: isDarkMode ?
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" :
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      terrain: isDarkMode ?
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" :
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    };
    return tileOptions[mapType];
  };

  if (isLoading) {
    return (
      <>
        <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gradient-to-r from-blue-50 to-indigo-100 border-neutral-200'} border-b`}>
          <div className="flex items-center space-x-3">
            <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>Đang tải bản đồ...</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-yellow-400' : 'bg-white hover:bg-neutral-50 text-neutral-600'} shadow-sm`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex flex-col items-center justify-center h-[400px] ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
          <div className="relative">
            <div className={`w-12 h-12 border-3 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'} border-t-transparent rounded-full animate-spin`}></div>
            <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
          </div>
          <p className={`mt-3 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'} text-sm`}>Đang định vị...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gradient-to-r from-red-50 to-pink-100 border-neutral-200'} border-b`}>
          <div className="flex items-center space-x-3">
            <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>Lỗi bản đồ</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-yellow-400' : 'bg-white hover:bg-neutral-50 text-neutral-600'} shadow-sm`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex flex-col items-center justify-center h-[400px] ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} p-6`}>
          <div className={`p-3 rounded-full ${isDarkMode ? 'bg-red-900/40' : 'bg-red-100'} mb-3`}>
            <MapPin className={`w-8 h-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          </div>
          <p className={`text-center ${isDarkMode ? 'text-red-300' : 'text-red-700'} font-medium mb-1`}>Không thể tải bản đồ</p>
          <p className={`text-center ${isDarkMode ? 'text-red-200' : 'text-red-600'} text-sm max-w-sm`}>{error}</p>
        </div>
      </>
    );
  }

  if (!position) {
    return (
      <>
        <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-neutral-200'} border-b`}>
          <div className="flex items-center space-x-3">
            <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>Không có vị trí</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-neutral-700 hover:bg-neutral-600 text-yellow-400' : 'bg-white hover:bg-neutral-50 text-neutral-600'} shadow-sm`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex items-center justify-center h-[400px] ${isDarkMode ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
          <p className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} text-sm`}>Không thể hiển thị bản đồ</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className={`flex items-center justify-between p-6 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gradient-to-r from-blue-50 to-indigo-100 border-neutral-200'} border-b`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <MapPin className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>Vị trí công việc</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{job.location || 'Vị trí không xác định'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={mapType}
                  onChange={(e) => setMapType(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-neutral-700 text-white' : 'bg-white text-neutral-700'} border border-neutral-300`}
                >
                  <option value="standard">Tiêu chuẩn</option>
                  <option value="satellite">Vệ tinh</option>
                  <option value="terrain">Địa hình</option>
                </select>

                <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${isDarkMode ? 'bg-neutral-700 text-yellow-400' : 'bg-white text-neutral-600'}`}>
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button onClick={toggleFullscreen} className={`p-2 rounded-lg ${isDarkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-white text-neutral-600'}`}>
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <MapContainer
              key={`fullscreen-${position.join('-')}-${isDarkMode}-${mapType}`}
              center={position}
              zoom={16}
              scrollWheelZoom={true}
              style={{ height: '70vh', width: '100%' }}
            >
              <TileLayer url={getTileLayerUrl()} />
              <Marker position={position}>
                <Popup>
                  <div className="font-sans p-2 min-w-[200px]">
                    <h4 className="font-bold text-base mb-2">{job.employerName || 'Nhà tuyển dụng'}</h4>
                    <p className="text-sm text-neutral-600 mb-3">{job.location}</p>
                    <div className="flex flex-col space-y-2">
                      <a
                        href={`https://maps.google.com/?q=${position[0]},${position[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-1 text-white">
                          <ExternalLink className="w-3 h-3" />
                          <span>Google Maps</span>
                        </div>

                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Control Bar */}
      {!isFullscreen && (
        <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-gradient-to-r from-blue-50 to-indigo-100 border-neutral-200'} border-b`}>
          <div className="flex items-center space-x-3">
            <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>
              {job.location || 'Vị trí không xác định'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}
                className={`appearance-none px-3 py-1.5 pr-7 rounded-lg text-xs font-medium transition-all ${isDarkMode
                  ? 'bg-neutral-700 text-white border-neutral-600 hover:bg-neutral-600'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
              >
                <option value="standard">Tiêu chuẩn</option>
                <option value="satellite">Vệ tinh</option>
                <option value="terrain">Địa hình</option>
              </select>
              <Layers className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`} />
            </div>

            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${isDarkMode
                ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
                : 'bg-white hover:bg-neutral-50 text-neutral-600'
                } shadow-sm`}
              title="Phóng to"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${isDarkMode
                ? 'bg-neutral-700 hover:bg-neutral-600 text-yellow-400'
                : 'bg-white hover:bg-neutral-50 text-neutral-600'
                } shadow-sm`}
              title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      {!isFullscreen && (
        <div className="relative">
          <MapContainer
            key={`${position.join('-')}-${isDarkMode}-${mapType}`}
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            style={{
              height: '400px',
              width: '100%',
              filter: isDarkMode && mapType === 'satellite' ? 'brightness(0.8) contrast(1.1)' : 'none'
            }}
          >
            <TileLayer
              attribution={mapType === 'satellite' ?
                '&copy; <a href="https://www.esri.com/">Esri</a>' :
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
              url={getTileLayerUrl()}
            />
            <Marker position={position}>
              <Popup className="custom-popup">
                <div className={`font-sans p-3 ${isDarkMode ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-800'} rounded-lg min-w-[280px]`}>
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} flex-shrink-0`}>
                      <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-neutral-900'} mb-1`}>
                        {job.employerName || 'Nhà tuyển dụng'}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'} mb-3 leading-relaxed`}>
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://maps.google.com/?q=${position[0]},${position[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center space-x-2 px-3 py-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]`}
                      style={{ textDecoration: 'none' }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Google Maps</span>
                    </a>

                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              const userLat = pos.coords.latitude;
                              const userLng = pos.coords.longitude;
                              window.open(`https://www.google.com/maps/dir/${userLat},${userLng}/${position[0]},${position[1]}`, '_blank');
                            },
                            (error) => {
                              console.error('Geolocation error:', error);
                              window.open(`https://www.google.com/maps/dir//${position[0]},${position[1]}`, '_blank');
                            }
                          );
                        } else {
                          window.open(`https://www.google.com/maps/dir//${position[0]},${position[1]}`, '_blank');
                        }
                      }}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]`}
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Chỉ đường</span>
                    </button>

                    <button
                      onClick={() => {
                        const coords = `${position[0]},${position[1]}`;
                        navigator.clipboard.writeText(coords).then(() => {
                          alert('Đã copy tọa độ: ' + coords);
                        });
                      }}
                      className={`col-span-2 flex items-center justify-center space-x-2 px-3 py-2 ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]`}
                    >
                      <Compass className="w-3 h-3" />
                      <span>Copy tọa độ: {position[0].toFixed(6)}, {position[1].toFixed(6)}</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Footer Info */}
      {!isFullscreen && (
        <div className={`px-4 py-3 ${isDarkMode ? 'bg-neutral-800/50' : 'bg-neutral-50'} border-t ${isDarkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className={`w-3 h-3 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                <span className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {position[0].toFixed(4)}, {position[1].toFixed(4)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Layers className={`w-3 h-3 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                <span className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {mapType === 'standard' ? 'Tiêu chuẩn' : mapType === 'satellite' ? 'Vệ tinh' : 'Địa hình'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
              <span className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>Đã tải</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobMap;