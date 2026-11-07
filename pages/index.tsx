import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-supabase-js';
import { ShieldCheck, Video, BookOpen, Users, Smartphone, PlusCircle, Radio, Check, X, Search, LogOut } from 'lucide-react';

// Connect to Supabase using public environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New Subject Form State
  const [newSubject, setNewSubject] = useState({
    name: '',
    doctor_name: '',
    price: 0,
    grade: 1,
    term: 1,
    doctor_image_url: '',
    subject_image_url: ''
  });

  // Live Stream State
  const [liveTitle, setLiveTitle] = useState('');
  const [liveGrade, setLiveGrade] = useState(1);
  const [liveUrl, setLiveUrl] = useState('');

  // New Payment Method State
  const [newPayProvider, setNewPayProvider] = useState('vodafone_cash');
  const [newPayNumber, setNewPayNumber] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'subscriptions') {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (data) setStudents(data);
    } else if (activeTab === 'content') {
      const { data } = await supabase.from('subjects').select('*').order('created_at', { ascending: false });
      if (data) setSubjects(data);
    } else if (activeTab === 'payments') {
      const { data } = await supabase.from('payment_methods').select('*');
      if (data) setPaymentMethods(data);
    }
    setLoading(false);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('subjects').insert([newSubject]);
    if (!error) {
      alert('تم إضافة المادة والدكتور بنجاح!');
      setNewSubject({ name: '', doctor_name: '', price: 0, grade: 1, term: 1, doctor_image_url: '', subject_image_url: '' });
      fetchData();
    } else {
      alert('حدث خطأ أثناء الإضافة: ' + error.message);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('payment_methods').insert([{ provider: newPayProvider, account_number_or_iban: newPayNumber, is_active: true }]);
    if (!error) {
      alert('تم إضافة رقم/وسيلة الدفع بنجاح!');
      setNewPayNumber('');
      fetchData();
    }
  };

  const toggleDeviceLock = async (userId: string, currentStatus: boolean) => {
    await supabase.from('users').update({ is_device_locked: !currentStatus }).eq('id', userId);
    fetchData();
  };

  const startLiveStream = async () => {
    if (!liveTitle || !liveUrl) return alert('برجاء كتابة عنوان البث والرابط');
    const { error } = await supabase.from('live_streams').insert([{ title: liveTitle, grade: liveGrade, stream_url: liveUrl, is_active: true }]);
    if (!error) {
      alert('تم إطلاق البث المباشر بنجاح للفرقة المختارة!');
      setLiveTitle('');
      setLiveUrl('');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 border-l border-amber-500/20 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shadow-amber-500/10">
              ⚖️
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-amber-400">الريادة القانونية</h1>
              <p className="text-xs text-slate-400">لوحة التحكم والإدارة الفائقة</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('subscriptions')} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'subscriptions' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Users size={20} /> إدارة الطلاب والأجهزة
            </button>

            <button 
              onClick={() => setActiveTab('content')} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-300 hover:bg-slate-800'}`}>
              <BookOpen size={20} /> المواد والدكاترة والتسعير
            </button>

            <button 
              onClick={() => setActiveTab('payments')} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'payments' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Smartphone size={20} /> حسابات الدفع (فودافون/انستا)
            </button>

            <button 
              onClick={() => setActiveTab('live')} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'live' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Radio size={20} /> البث المباشر (Live)
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          سنتر الريادة القانونية © 2026
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-10 overflow-y-auto bg-slate-950">
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-amber-400">إدارة الطلاب وتقييد الأجهزة</h2>
                <p className="text-slate-400 text-sm mt-1">التحكم في السماح بالطالب وتسجيلات الأجهزة المزدوجة</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-800/60 text-amber-400 text-sm">
                    <th className="p-4">اللقب والطالب</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">الجهاز المسجل (Device ID)</th>
                    <th className="p-4">قفل الجهاز الوحيد</th>
                    <th className="p-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">لا يوجد طلاب مسجلون حالياً</td>
                    </tr>
                  ) : (
                    students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 font-bold text-slate-200">
                          {s.gender === 'female' ? 'المستشارة' : 'المستشار'} {s.name}
                        </td>
                        <td className="p-4 text-slate-400 dir-ltr text-right">{s.phone}</td>
                        <td className="p-4 font-mono text-xs text-amber-300/80 bg-slate-950/50 px-2 py-1 rounded w-fit">
                          {s.device_id || 'لم يسجل بعد'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.is_device_locked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {s.is_device_locked ? 'جهاز واحد فقط (مُقفل)' : 'مسموح بتسجيل هاتف جديد'}
                          </span>
                        </td>
                        <td className="p-4 space-x-2 space-x-reverse">
                          <button 
                            onClick={() => toggleDeviceLock(s.id, s.is_device_locked)}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-amber-500/20">
                            {s.is_device_locked ? 'فتح السماح بجهاز آخر' : 'قفل الحساب على جهاز واحد'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-amber-400">إضافة مادة ودكتور وتحديد السعر</h2>
              <p className="text-slate-400 text-sm mt-1">تنسيق الفرقة واسم الدكتور والصورة وسعر الحجز المنفرد</p>
            </div>

            <form onSubmit={handleAddSubject} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">اسم المادة</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: مدخل العلوم القانونية" 
                    value={newSubject.name} 
                    onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 text-slate-100" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">اسم الدكتور المحاضر</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: د. أحمد صلاح" 
                    value={newSubject.doctor_name} 
                    onChange={e => setNewSubject({...newSubject, doctor_name: e.target.value})}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 text-slate-100" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">الفرقة الدراسية</label>
                  <select 
                    value={newSubject.grade} 
                    onChange={e => setNewSubject({...newSubject, grade: Number(e.target.value)})}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100">
                    <option value={1}>الفرقة الأولى</option>
                    <option value={2}>الفرقة الثانية</option>
                    <option value={3}>الفرقة الثالثة</option>
                    <option value={4}>الفرقة الرابعة</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">الترم الدراسي</label>
                  <select 
                    value={newSubject.term} 
                    onChange={e => setNewSubject({...newSubject, term: Number(e.target.value)})}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100">
                    <option value={1}>الترم الأول</option>
                    <option value={2}>الترم الثاني</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">سعر شراء المادة منفردة (جنية)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="150" 
                    value={newSubject.price} 
                    onChange={e => setNewSubject({...newSubject, price: Number(e.target.value)})}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 text-slate-100" />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">رابط صورة الدكتور/المادة (URL)</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={newSubject.doctor_image_url} 
                    onChange={e => setNewSubject({...newSubject, doctor_image_url: e.target.value})}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 text-slate-100" />
                </div>
              </div>

              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 transition">
                حفظ ونشر المادة للتطبيق
              </button>
            </form>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-amber-400">إدارة وسائل وأرقام الدفع</h2>
              <p className="text-slate-400 text-sm mt-1">إضافة أكثر من رقم لفودافون كاش وحسابات انستا باي والفيزا</p>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">وسيلة الدفع</label>
                  <select 
                    value={newPayProvider} 
                    onChange={e => setNewPayProvider(e.target.value)}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100">
                    <option value="vodafone_cash">فودافون كاش (Vodafone Cash)</option>
                    <option value="instapay">انستا باي (InstaPay)</option>
                    <option value="visa">فيزا / كارت بنكي (Visa)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-300">رقم الهاتف أو المعرّف للتحويل</label>
                  <input 
                    type="text" 
                    required
                    placeholder="010xxxxxxx أو username@instapay" 
                    value={newPayNumber} 
                    onChange={e => setNewPayNumber(e.target.value)}
                    className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 focus:border-amber-400 focus:outline-none" />
                </div>
              </div>

              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg shadow-amber-500/20 transition">
                إضافة وسيلة الدفع
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentMethods.map(pm => (
                <div key={pm.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase">
                      {pm.provider.replace('_', ' ')}
                    </span>
                    <p className="text-lg font-mono font-bold text-slate-200 mt-2">{pm.account_number_or_iban}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-amber-400">إطلاق بث مباشر للفرقة (Live)</h2>
              <p className="text-slate-400 text-sm mt-1">تحديد الفرقة المستهدفة بالبث المباشر فوراً</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div>
                <label className="block mb-2 text-sm font-bold text-slate-300">اختر الفرقة المسموح لها بحضور البث</label>
                <select 
                  value={liveGrade} 
                  onChange={e => setLiveGrade(Number(e.target.value))}
                  className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100">
                  <option value={1}>الفرقة الأولى</option>
                  <option value={2}>الفرقة الثانية</option>
                  <option value={3}>الفرقة الثالثة</option>
                  <option value={4}>الفرقة الرابعة</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-300">عنوان البث المباشر</label>
                <input 
                  type="text" 
                  placeholder="مراجعة ليلة الامتحان مادة المدخل القانوني" 
                  value={liveTitle} 
                  onChange={e => setLiveTitle(e.target.value)}
                  className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 focus:border-amber-400 focus:outline-none" />
              </div>

              <div>
                <label className="block mb-2 text-sm font-bold text-slate-300">رابط البث (Stream URL / Agora Channel)</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={liveUrl} 
                  onChange={e => setLiveUrl(e.target.value)}
                  className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-100 focus:border-amber-400 focus:outline-none" />
              </div>

              <button 
                onClick={startLiveStream}
                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center gap-2">
                <Radio size={20} /> بدء إطلاق البث المباشر للطلاب
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
