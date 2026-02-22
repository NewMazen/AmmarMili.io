import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ArrowLeft, Save, RotateCcw, Edit2 } from 'lucide-react';
import { Question } from '../types';
import { getQuestions, saveQuestions, resetQuestions } from '../utils/questions';

interface AdminScreenProps {
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  useEffect(() => {
    setQuestions(getQuestions());
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      const updated = questions.filter(q => q.id !== id);
      setQuestions(updated);
      saveQuestions(updated);
    }
  };

  const handleEdit = (q: Question) => {
    setNewQuestion({
      text: q.text,
      options: [...q.options],
      correctAnswer: q.correctAnswer
    });
    setEditingId(q.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveQuestion = () => {
    if (!newQuestion.text || newQuestion.options.some(opt => !opt)) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    let updated: Question[];
    if (editingId !== null) {
      updated = questions.map(q => q.id === editingId ? { ...newQuestion, id: editingId } : q);
    } else {
      const id = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
      updated = [...questions, { ...newQuestion, id }];
    }

    setQuestions(updated);
    saveQuestions(updated);
    setIsAdding(false);
    setEditingId(null);
    setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  const handleReset = () => {
    if (window.confirm('هل تريد استعادة الأسئلة الأصلية؟ سيتم حذف جميع تعديلاتك.')) {
      const original = resetQuestions();
      setQuestions(original);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 text-ramadan-gold hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-ramadan-gold">لوحة التحكم بالأسئلة</h1>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0 });
          }}
          className="flex-1 bg-ramadan-gold text-ramadan-green font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          إضافة سؤال جديد
        </button>
        <button
          onClick={handleReset}
          className="px-4 bg-white/10 text-white border border-white/20 rounded-xl flex items-center justify-center gap-2"
          title="استعادة الأسئلة الأصلية"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-md border border-ramadan-gold/30 p-6 rounded-3xl space-y-4 mb-8"
          >
            <h2 className="text-xl font-bold text-white text-right mb-4">
              {editingId !== null ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
            </h2>
            <div className="space-y-2">
              <label className="block text-right text-sm text-ramadan-gold">نص السؤال</label>
              <input
                type="text"
                value={newQuestion.text}
                onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="w-full bg-white/5 border border-white/20 text-white rounded-xl p-3 text-right"
                placeholder="اكتب السؤال هنا..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newQuestion.options.map((opt, i) => (
                <div key={i} className="space-y-2">
                  <label className="flex justify-between text-sm text-ramadan-gold">
                    <input 
                      type="radio" 
                      name="correct" 
                      checked={newQuestion.correctAnswer === i}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: i })}
                    />
                    <span>الخيار {i + 1}</span>
                  </label>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const newOpts = [...newQuestion.options];
                      newOpts[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOpts });
                    }}
                    className="w-full bg-white/5 border border-white/20 text-white rounded-xl p-3 text-right"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSaveQuestion}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl"
              >
                {editingId !== null ? 'تحديث السؤال' : 'حفظ السؤال'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-white/5 text-white py-3 rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div 
            key={q.id}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-start justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleDelete(q.id)}
                className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => handleEdit(q)}
                className="text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="تعديل"
              >
                <Edit2 size={18} />
              </button>
            </div>
            
            <div className="flex-1 text-right">
              <div className="text-white font-bold mb-2">{idx + 1}. {q.text}</div>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <div 
                    key={i}
                    className={`text-xs p-2 rounded-lg ${i === q.correctAnswer ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-white/60'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
